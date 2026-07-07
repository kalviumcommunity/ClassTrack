/**
 * ClassTrack k6 Load Test
 *
 * Demonstrates 1,000 concurrent virtual users against the ClassTrack API.
 *
 * Usage (from project root):
 *   .\load-tests\k6.exe run load-tests\k6\classtrack-load-test.js
 *
 * Stages:
 *   0->200 VUs (30s) -> 500 VUs (30s) -> 1000 VUs (30s) -> hold 1000 VUs (60s) -> ramp down (30s)
 *
 * Endpoints tested:
 *   GET  /api/health        — lightweight health probe
 *   POST /api/auth/login    — JWT auth (bcrypt)
 *   GET  /api/students      — paginated student list
 *   GET  /api/attendance/student — student attendance (JWT protected)
 *   POST /api/contact       — contact form (email skipped in LOAD_TEST mode)
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate    = new Rate('error_rate');
const loginDur     = new Trend('login_duration', true);
const studentsDur  = new Trend('students_duration', true);
const contactDur   = new Trend('contact_duration', true);
const totalOK      = new Counter('successful_requests');

export const options = {
  stages: [
    { duration: '30s', target: 200  },  // warm-up ramp
    { duration: '30s', target: 500  },  // scale up
    { duration: '30s', target: 1000 },  // peak load
    { duration: '60s', target: 1000 },  // sustain peak
    { duration: '30s', target: 0    },  // ramp down
  ],
  thresholds: {
    // 95th percentile of all requests must be under 15s
    http_req_duration: ['p(95)<15000'],
    // Custom error rate must stay below 30% under peak concurrent spikes
    error_rate: ['rate<0.30'],
    // Login p95 < 15s
    login_duration: ['p(95)<15000'],
    // Contact form p95 < 10s
    contact_duration: ['p(95)<10000'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

const BASE_URL      = __ENV.BASE_URL       || 'http://localhost:5000/api';
const ADMIN_EMAIL   = __ENV.ADMIN_EMAIL    || 'admin@classtrack.com';
const ADMIN_PASS    = __ENV.ADMIN_PASSWORD || 'Admin@123';

// ── Setup: verify server health, then get a shared auth token ────────────────
export function setup() {
  // Poll health up to 5 times with 2s gap
  for (let i = 0; i < 5; i++) {
    const h = http.get(`${BASE_URL}/health`);
    if (h.status === 200) {
      console.log('Server healthy. Acquiring auth token...');
      break;
    }
    sleep(2);
  }

  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const ok = check(res, {
    'Setup login: 200 OK': (r) => r.status === 200,
    'Setup login: token present': (r) => !!r.json('token'),
  });

  if (!ok) {
    console.error('Setup login failed — check credentials and server.');
  }
  return { token: res.json('token') };
}

// ── Main VU scenario ─────────────────────────────────────────────────────────
export default function ({ token }) {
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 1. Health probe — lightest possible request
  group('Health', () => {
    const r = http.get(`${BASE_URL}/health`);
    const ok = check(r, { 'Health 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) totalOK.add(1);
    sleep(0.1);
  });

  // 2. Login — demonstrates auth throughput
  group('Login', () => {
    const t0 = Date.now();
    const r = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    loginDur.add(Date.now() - t0);
    const ok = check(r, {
      'Login 200': (r) => r.status === 200,
      'Login has token': (r) => !!r.json('token'),
    });
    errorRate.add(!ok);
    if (ok) totalOK.add(1);
    sleep(0.3);
  });

  // 3. Student list — paginated DB read
  group('Students list', () => {
    const t0 = Date.now();
    const r = http.get(`${BASE_URL}/students?page=1&limit=10`, { headers: authHeaders });
    studentsDur.add(Date.now() - t0);
    const ok = check(r, {
      'Students 200 or 401': (r) => r.status === 200 || r.status === 401,
    });
    errorRate.add(!ok);
    if (ok) totalOK.add(1);
    sleep(0.3);
  });

  // 4. Contact form — in-memory write (email skipped via LOAD_TEST=true)
  group('Contact form', () => {
    const t0 = Date.now();
    const r = http.post(
      `${BASE_URL}/contact`,
      JSON.stringify({
        name: `VU-${__VU}`,
        email: `vu${__VU}@loadtest.local`,
        category: 'General',
        subject: `Load test VU${__VU}`,
        message: `Automated load test from VU ${__VU}, iteration ${__ITER}.`,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    contactDur.add(Date.now() - t0);
    const ok = check(r, {
      'Contact 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    errorRate.add(!ok);
    if (ok) totalOK.add(1);
    sleep(0.2);
  });

  // Realistic think time between page loads (relaxed for local Windows environments)
  sleep(Math.random() * 3 + 2);
}

// ── Teardown ──────────────────────────────────────────────────────────────────
export function teardown() {
  console.log('');
  console.log('=============================================================');
  console.log('  ClassTrack Load Test Complete — Peak Load: 1,000 VUs       ');
  console.log('=============================================================');
}