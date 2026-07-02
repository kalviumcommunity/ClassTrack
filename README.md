# 📚 ClassTrack — Student Attendance Management System

<div align="center">

![ClassTrack Banner](https://img.shields.io/badge/ClassTrack-Attendance%20Management-2563eb?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwind-css)](https://tailwindcss.com)

**A modern, full-stack student attendance management system built with the MERN stack.**

[🔗 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](../../issues/new?template=bug_report.md) • [💡 Request Feature](../../issues/new?template=feature_request.md)

</div>

---

## ✨ Features

### 👤 Admin Portal
- 🔐 **Secure Authentication** — JWT-based login with bcrypt password hashing
- 📊 **Analytics Dashboard** — Live statistics with interactive Recharts visualizations
- 👥 **Student Management** — Add, edit, delete students with search & pagination
- ✅ **Attendance Marking** — Bulk mark Present/Late/Absent with a grid UI
- 📈 **Reports** — Filter by department/year/section/date, export as PDF or CSV
- 📨 **Contact Inbox** — View all submitted feedback messages

### 🎓 Student Portal
- 📅 **Attendance History** — Personal attendance records with monthly breakdown
- 🥧 **Visual Analytics** — Radial progress chart for attendance percentage
- 👤 **Profile Management** — Update personal info and change password

### 🌟 Platform Features
- 🔍 **AI Smart Search** — OpenAI embedding-based student search with fuzzy fallback
- 📧 **Automated Emails** — Welcome emails on signup + contact form acknowledgements
- 📊 **Google Analytics** — GA4 page view and event tracking
- ⚡ **Load Tested** — Verified to handle 1,000+ concurrent users with k6
- 🛡️ **Rate Limiting** — 200 req/15min per IP via `express-rate-limit`
- 🔒 **Security Headers** — Helmet.js for HTTP security headers

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v3, Recharts, Lucide React |
| **Backend** | Node.js, Express 4, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB (Atlas or local) |
| **Email** | Nodemailer (SMTP/Gmail) |
| **AI** | OpenAI `text-embedding-ada-002` (with fuzzy fallback) |
| **Analytics** | Google Analytics 4 (react-ga4) |
| **Load Testing** | k6 |
| **Security** | Helmet, express-rate-limit, CORS |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- npm ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/kalviumcommunity/ClassTrack.git
cd ClassTrack
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/classtrack
JWT_SECRET=your_strong_secret_here

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# OpenAI (optional - falls back to fuzzy search)
OPENAI_API_KEY=sk-...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # optional
```

### 3. Install dependencies

```bash
# Install all (root + backend + frontend)
npm install
cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps
cd ..
```

### 4. Seed the default admin

```bash
cd backend && npm run seed
```

Default credentials:
- **Email**: `admin@classtrack.com`
- **Password**: `Admin@123`

### 5. Start the development servers

From the **root** directory:

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173) concurrently.

Or start them separately:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
ClassTrack/
├── backend/                  # Node.js + Express API
│   ├── config/               # Database connection
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth & role middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── services/             # AI search service
│   ├── utils/                # Email service, seed script
│   └── server.js             # Entry point
│
├── frontend/                 # React + Vite app
│   └── src/
│       ├── components/       # Reusable components
│       ├── context/          # Auth & GA context
│       ├── pages/            # Route pages
│       └── App.jsx           # Routing
│
├── load-tests/               # k6 load testing scripts
│   └── k6/
│       └── classtrack-load-test.js
│
├── .github/                  # GitHub issue templates & workflows
└── README.md
```

---

## 🧪 Load Testing

### Install k6

```bash
# Windows (Chocolatey)
choco install k6

# macOS
brew install k6

# Linux
sudo apt install k6
```

### Run the load test

Make sure both backend and MongoDB are running, then:

```bash
# Default: targets http://localhost:5000/api
k6 run load-tests/k6/classtrack-load-test.js

# Custom base URL
BASE_URL=https://your-api.com/api k6 run load-tests/k6/classtrack-load-test.js
```

The script ramps from 0 → 1,000 VUs and verifies:
- 95th-percentile response time < 2s
- Error rate < 5%

---

## 📬 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/signup` | Public | Register |
| GET/PUT | `/api/auth/profile` | JWT | View/update profile |
| GET | `/api/students` | Admin | List students (paginated) |
| POST | `/api/students` | Admin | Create student |
| PUT | `/api/students/:id` | Admin | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |
| POST | `/api/attendance/mark` | Admin | Bulk mark attendance |
| GET | `/api/attendance` | JWT | Get attendance records |
| GET | `/api/reports` | Admin | Filtered attendance report |
| GET | `/api/reports/dashboard` | Admin | Dashboard statistics |
| POST | `/api/contact` | Public | Submit contact form |
| GET | `/api/contact` | Admin | View all feedback |
| GET | `/api/ai/search?q=` | JWT | AI-powered student search |

---

## 🤝 Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting a PR.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Recharts](https://recharts.org/) for beautiful charts
- [Lucide React](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [k6](https://k6.io/) for load testing

---

<div align="center">
Made with ❤️ by the ClassTrack team
</div>
