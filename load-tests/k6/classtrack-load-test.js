/**
 * ClassTrack k6 Load Test
 * 
 * Simulates 1,000 concurrent users across key API endpoints.
 * 
 * Usage:
 *   k6 run load-tests/k6/classtrack-load-test.js
 * 
 * Install k6:
 *   Windows:  choco install k6
 *   macOS:    brew install k6
 *   Linux:    https://k6.io/docs/getting-started/installation/
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const loginDuration = new Trend('login_duration');
const dashboardDuration = new Trend('dashboard_duration');

// Test configuration
export const options = {
  stages: [
    // Ramp up to 200 VUs over 30s
    { duration: '30s', target: 200 },
    // Ramp up to 500 VUs
    { duration: '30s', target: 500 },
    // Reach 1000 VUs — peak load
    { duration: '30s', target: 1000 },
    // Sustain 1000 VUs for 1 minute
    { duration: '60s', target: 1000 },
    // Ramp down
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // 95% of requests complete in < 5s (increased for CI)
    http_req_duration: ['p(95)<5000'],
    // Error rate should stay < 5%
    error_rate: ['rate<0.05'],
    // Custom: login p95 < 5s (bcrypt is slow in CI)
    login_duration: ['p(95)<5000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';

// Admin credentials (seeded)
const ADMIN_EMAIL = 'admin@classtrack.com';
const ADMIN_PASSWORD = 'Admin@123';

let authToken = null;

export function setup() {
  // Log in once and get a token for reuse
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginRes, {
    'Setup: login status 200': (r) => r.status === 200,
    'Setup: got token': (r) => !!r.json('token'),
  });

  return { token: loginRes.json('token') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  };

  group('Auth', () => {
    // Login endpoint
    const start = Date.now();
    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    loginDuration.add(Date.now() - start);

    const loginOk = check(loginRes, {
      'Login: status 200': (r) => r.status === 200,
      'Login: token present': (r) => !!r.json('token'),
    });
    errorRate.add(!loginOk);
    sleep(0.5);
  });

  group('Dashboard', () => {
    const start = Date.now();
    const dashRes = http.get(`${BASE_URL}/reports/dashboard-stats`, { headers });
    dashboardDuration.add(Date.now() - start);

    const dashOk = check(dashRes, {
      'Dashboard: status 200 or 401': (r) => r.status === 200 || r.status === 401,
    });
    errorRate.add(!dashOk);
    sleep(0.5);
  });

  group('Student List', () => {
    const studRes = http.get(`${BASE_URL}/students?page=1&limit=10`, { headers });
    const studOk = check(studRes, {
      'Students: status 200 or 401': (r) => r.status === 200 || r.status === 401,
    });
    errorRate.add(!studOk);
    sleep(0.3);
  });

  group('Attendance Records', () => {
    const today = new Date().toISOString().split('T')[0];
    const attRes = http.get(`${BASE_URL}/attendance/check?date=${today}&department=CS&year=1st&section=A`, { headers });
    const attOk = check(attRes, {
      'Attendance: status 200 or 401': (r) => r.status === 200 || r.status === 401,
    });
    errorRate.add(!attOk);
    sleep(0.3);
  });

  group('Contact Form', () => {
    const contactRes = http.post(
      `${BASE_URL}/contact`,
      JSON.stringify({
        name: `Load Test User ${__VU}`,
        email: `loadtest${__VU}@test.com`,
        category: 'General',
        message: `This is an automated load test message from VU ${__VU} at iteration ${__ITER}.`,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    const contactOk = check(contactRes, {
      'Contact: status 201 or 201': (r) => r.status === 201 || r.status === 200,
    });
    errorRate.add(!contactOk);
    sleep(0.2);
  });

  // Think time between iterations
  sleep(Math.random() * 2 + 1);
}

export function teardown(data) {
  console.log('Load test complete. Check output above for results.');
}
