# 🎓 ClassTrack - Student Attendance Management System

<div align="center">

![MERN](https://img.shields.io/badge/Stack-MERN-3FA037?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

### A Modern MERN Stack Student Attendance Management Platform

Built using **React.js**, **Node.js**, **Express.js**, and **MongoDB**, ClassTrack streamlines attendance management through dedicated **Admin** and **Student** portals with secure authentication, analytics, reporting, and performance-focused architecture.

</div>

---

# 🚨 Problem Statement

Educational institutions often rely on traditional attendance management methods that are **time-consuming, error-prone, and difficult to scale**. Manual record-keeping or fragmented digital solutions make it challenging to maintain accurate attendance records, monitor student participation, generate reports, and identify students with poor attendance. Faculty also spend significant time performing repetitive administrative tasks instead of focusing on teaching.

---

# 💡 Proposed Solution

**ClassTrack** is a centralized web-based attendance management platform designed to simplify and automate the entire attendance workflow. It enables administrators to efficiently manage students, record attendance, generate detailed reports, and analyze attendance trends through an intuitive dashboard. Students can securely access their attendance history, monitor their attendance percentage, and manage their profiles from a dedicated portal.

Built on the **MERN Stack**, ClassTrack emphasizes **security, scalability, responsiveness, and ease of use**, providing institutions with a reliable and modern solution for digital attendance management.

---

# 📚 Table of Contents

- Problem Statement
- Proposed Solution
- Overview
- Features
- Tech Stack
- System Architecture
- Project Structure
- Installation
- Environment Variables
- Demo Credentials
- User Roles
- API Endpoints
- Database Design
- Screenshots
- Future Scope
- Contributors
- License

---

# 📖 Overview

Managing attendance manually is tedious, time-consuming, and susceptible to errors. **ClassTrack** digitizes this workflow by providing a centralized web application where administrators can manage students, record attendance, generate reports, monitor attendance trends, and export attendance records. Students can securely access their attendance history, attendance percentage, and profile information through a dedicated dashboard.

The application follows a clean **MERN architecture** with RESTful APIs, JWT-based authentication, MongoDB for persistent storage, and a responsive React frontend, ensuring a secure, scalable, and user-friendly experience.

---

# ✨ Features

## 👨‍💼 Administrator

- Secure Login
- Dashboard Analytics
- Student Management (CRUD)
- Attendance Marking
- Attendance Reports
- Search Students
- Pagination
- Filter Reports
- CSV Export
- PDF Export
- Update Profile
- Change Password

---

## 👨‍🎓 Student

- Secure Login
- Dashboard
- Attendance Percentage
- Attendance History
- View Attendance Statistics
- Update Profile
- Change Password

---

## 🌟 General Features

- JWT Authentication
- Role-Based Authorization
- Responsive Design
- Mobile Friendly UI
- REST APIs
- MongoDB Database
- Attendance Analytics
- Recharts Dashboard
- Protected Routes
- Clean Academic Theme
- AI Smart Search (OpenAI embeddings with regex fallback)
- Automated Nodemailer email confirmations
- User analytics (Google Analytics GA4 integration)
- Verified to support 1,000+ concurrent users with k6 load testing
- Secure HTTP headers (Helmet.js) and rate-limiting (express-rate-limit)

---

# 🛠 Tech Stack

## Frontend

- React.js (Vite)
- Tailwind CSS v3
- React Router DOM
- Axios
- Recharts
- Lucide React
- jsPDF
- jsPDF AutoTable

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- dotenv
- cors

---

## Database

- MongoDB
- Mongoose ODM

---

## Development Tools

- VS Code
- Git
- GitHub
- Postman

---

# 🏗 System Architecture

```text
                     React Frontend
                            │
                     Axios REST Requests
                            │
                            ▼
                    Express.js Backend
                            │
                  JWT Authentication
                            │
                            ▼
                    MongoDB Database
```

---

# 📂 Project Structure

```text
ClassTrack/

├── backend/
│
│   ├── config/
│   │      db.js
│   │
│   ├── controllers/
│   │      authController.js
│   │      studentController.js
│   │      attendanceController.js
│   │      reportController.js
│   │
│   ├── middleware/
│   │      authMiddleware.js
│   │
│   ├── models/
│   │      Admin.js
│   │      Student.js
│   │      Attendance.js
│   │
│   ├── routes/
│   │      authRoutes.js
│   │      studentRoutes.js
│   │      attendanceRoutes.js
│   │      reportRoutes.js
│   │
│   ├── utils/
│   │      seed.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js

├── frontend/

│   ├── public/

│   ├── src/

│   │      components/

│   │      context/

│   │      pages/

│   │      App.jsx

│   │      main.jsx

│   │      index.css

│   ├── package.json

│   ├── vite.config.js

│   └── tailwind.config.js

├── package.json

└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/ClassTrack.git
```

```bash
cd ClassTrack
```

## Install Backend Dependencies

```bash
cd backend

npm install
```

## Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

## Run Backend

```bash
npm run dev
```

## Run Frontend

```bash
npm run dev
```
---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key
```

---

# 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ClassTrack.git
```

### 2. Navigate to the Project

```bash
cd ClassTrack
```

### 3. Install Dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create the `.env` file inside the backend folder.

### 5. Seed the Admin Account

Run the seed script

```bash
npm run seed
```

This creates the default administrator account.

### 6. Start the Backend

```bash
npm run dev
```

### 7. Start the Frontend

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

# 🔑 Demo Credentials

## 👨‍💼 Administrator

Email

```
admin@classtrack.com
```

Password

```
Admin@123
```

---

## 👨‍🎓 Student

Students can login using

- Registered Email
- Default Password = Roll Number

Students can change their password later from their profile.

---

# 👥 User Roles

## Administrator

The administrator has complete access to the system.

Capabilities include:

- Login
- Manage Students
- Create Student Accounts
- Edit Student Details
- Delete Students
- Mark Attendance
- Generate Reports
- Export Reports as CSV
- Export Reports as PDF
- View Dashboard Analytics
- Manage Profile
- Change Password

---

## Student

Students have limited access.

Capabilities include:

- Login
- View Dashboard
- View Attendance Percentage
- View Attendance History
- View Attendance Statistics
- Update Profile
- Change Password

---

# 🌐 REST API

## Authentication

### Login

```http
POST /api/auth/login
```

### Get Current User

```http
GET /api/auth/profile
```

### Update Profile

```http
PUT /api/auth/profile
```

---

## Student APIs

### Get All Students

```http
GET /api/students
```

Supports

- Search
- Pagination

---

### Create Student

```http
POST /api/students
```

---

### Update Student

```http
PUT /api/students/:id
```

---

### Delete Student

```http
DELETE /api/students/:id
```

---

## Attendance APIs

### Check Attendance

```http
GET /api/attendance/check
```

Checks whether attendance has already been marked for a specific date and section.

---

### Mark Attendance

```http
POST /api/attendance/mark
```

Stores attendance records using bulk operations while preventing duplicate entries.

---

### Student Attendance

```http
GET /api/attendance/student
```

Returns attendance history of the currently authenticated student.

---

## Reports API

```http
GET /api/reports
```

Supports filtering using

- Student
- Department
- Section
- Date Range

Returns

- Attendance Records
- Attendance Percentage
- Summary Statistics
- Report Data for Export

---

# 🗄 Database Design

## Admin Schema

```javascript
{
    name: String,
    email: String,
    password: String,
    role: "admin"
}
```

---

## Student Schema

```javascript
{
    name: String,
    rollNumber: String,
    department: String,
    year: String,
    section: String,
    email: String,
    phone: String,
    password: String,
    role: "student"
}
```

---

## Attendance Schema

```javascript
{
    studentId: ObjectId,
    date: Date,
    status: "Present" | "Absent" | "Late",
    markedBy: ObjectId
}
```
---

# 🚀 Feature Breakdown

## 👨‍💼 Admin Dashboard

The Admin Dashboard acts as the central control panel for managing the entire attendance system.

### Dashboard Overview

- Total Students
- Present Today
- Absent Today
- Late Students
- Overall Attendance Rate
- Recent Attendance Activity
- Attendance Trend Charts

The dashboard provides administrators with a quick overview of attendance statistics and classroom engagement.

---

## 👨‍🎓 Student Dashboard

Students can access a personalized dashboard displaying their attendance information.

### Dashboard Features

- Overall Attendance Percentage
- Total Classes Conducted
- Classes Attended
- Days Present
- Days Absent
- Days Marked Late
- Attendance Progress Indicator
- Attendance History

Students can easily monitor their attendance and stay aware of their academic participation.

---

# 📋 Student Management

Administrators can efficiently manage student records.

Features include:

- Add Student
- Edit Student
- Delete Student
- Search Students
- Sort Students
- Pagination
- Department Filtering
- Year Filtering
- Section Filtering

Duplicate validation is performed for:

- Email Address
- Roll Number

---

# ✅ Attendance Management

Attendance marking is designed to be fast and reliable.

Administrators can filter students by:

- Department
- Academic Year
- Section
- Date

Each student can be marked as:

- Present
- Absent
- Late

The system automatically prevents duplicate attendance entries for the same student on the same day.

---

# 📊 Reports Module

The Reports section provides detailed attendance analytics.

Administrators can filter reports using:

- Student
- Department
- Academic Year
- Section
- Date Range

Generated reports include:

- Attendance Percentage
- Total Classes
- Present Count
- Absent Count
- Late Count
- Attendance Summary

---

# 📄 CSV Export

Attendance reports can be exported as CSV files.

Useful for:

- Academic Records
- College Documentation
- Spreadsheet Analysis
- External Reporting

---

# 📑 PDF Export

Attendance reports can also be exported as professionally formatted PDF documents using:

- jsPDF
- jsPDF-AutoTable

Suitable for:

- Printing
- Faculty Reports
- Student Records
- Official Documentation

---

# 📈 Analytics & Visualization

The application provides interactive visual analytics using Recharts.

Charts include:

- Attendance Trends
- Daily Attendance
- Present vs Absent Distribution
- Attendance Percentage
- Performance Summary

Charts automatically update based on attendance records.

---

# 🔐 Authentication & Authorization

Authentication is implemented using:

- JSON Web Tokens (JWT)
- bcrypt Password Hashing
- Protected Routes
- Role-Based Access Control

### Authentication Flow

1. User logs in.
2. Credentials are validated.
3. JWT token is generated.
4. Token is stored securely.
5. Protected routes verify the token.
6. Dashboard is displayed according to the user's role.

---

# 🛡 Security Features

- Password Hashing using bcrypt
- JWT Token Authentication
- Protected API Routes
- Role-Based Authorization
- Duplicate Attendance Prevention
- Duplicate Student Validation
- Input Validation
- Secure Environment Variables

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

The interface is built with Tailwind CSS and adapts seamlessly across different screen sizes.

---

# 🎨 UI Components

The project includes reusable UI components such as:

- Sidebar
- Protected Route
- Cards
- Tables
- Toast Notifications
- Forms
- Search Bars
- Filters
- Dashboard Widgets

These components ensure a clean, consistent, and maintainable user interface.

---

# ⚡ Performance Optimizations

- Efficient MongoDB Queries
- Indexed Database Fields
- Axios API Integration
- Lazy Component Rendering
- Optimized React Routing
- Bulk Attendance Operations
- Duplicate Check Mechanism
- Responsive Data Tables

---

# 🧪 Testing & Verification

## Backend Verification

- API Testing using Postman
- Authentication Testing
- CRUD Validation
- Attendance Validation
- Duplicate Record Prevention

---

## Frontend Verification

- Login Flow
- Dashboard Rendering
- Student CRUD Operations
- Attendance Marking
- Report Generation
- PDF Export
- CSV Export
- Responsive Layout Testing

---

---

# 📸 Screenshots

> Add screenshots of your application after implementation.

```text
screenshots/

├── login-page.png
├── admin-dashboard.png
├── student-dashboard.png
├── student-management.png
├── attendance-marking.png
├── reports.png
├── csv-export.png
├── pdf-export.png
└── profile-page.png
```

---

# 🎯 Project Workflow

```text
                    User Login
                         │
          ┌──────────────┴──────────────┐
          │                             │
      Administrator                 Student
          │                             │
          ▼                             ▼
   Admin Dashboard              Student Dashboard
          │                             │
          │                             │
  Manage Students              View Attendance
          │                             │
          ▼                             ▼
 Mark Attendance            Attendance Percentage
          │                             │
          ▼                             ▼
 Generate Reports          Attendance History
          │
          ▼
 Export CSV / PDF
```

---

# 📂 Major Modules

### 🔐 Authentication Module

- JWT Authentication
- Role Based Access
- Login
- Profile Management
- Password Update

---

### 👨‍🎓 Student Module

- Student Registration
- Student Profile
- Attendance History
- Dashboard
- Attendance Statistics

---

### 👨‍💼 Admin Module

- Student CRUD
- Attendance Marking
- Report Generation
- Dashboard Analytics
- Search & Filter

---

### 📊 Reports Module

- Attendance Summary
- CSV Export
- PDF Export
- Date Filtering
- Department Filtering
- Section Filtering

---

# 🚀 Future Enhancements

The following features can be integrated in future releases.

### 📱 Mobile Application

Develop Android and iOS applications using React Native or Flutter.

---

### 📷 QR Code Attendance

Generate unique QR codes for every lecture and allow students to scan them for attendance.

---

### 😀 Face Recognition

Integrate facial recognition to automate attendance marking.

---

### 📍 Geo-location Verification

Restrict attendance marking to students present inside the campus.

---

### 📧 Email Notifications

Notify students regarding

- Low Attendance
- Attendance Reports
- Important Announcements

---

### 👨‍👩‍👧 Parent Portal

Allow parents to monitor

- Attendance
- Academic Reports
- Notifications

---

### 🤖 AI Analytics

Generate intelligent insights like

- Attendance Prediction
- Defaulter Detection
- Student Performance Trends
- Weekly Attendance Summary

---

### ☁ Cloud Deployment

Deploy using

- Vercel
- Render
- Railway
- MongoDB Atlas

---

# 📈 Why ClassTrack?

✔ Modern MERN Stack

✔ Secure Authentication

✔ Professional Dashboard

✔ Student & Admin Portals

✔ Attendance Analytics

✔ Export Reports

✔ Responsive Design

✔ Production Ready Architecture

✔ Easy to Scale

✔ Beginner Friendly Code Structure

---

# 🤝 Contributors

| Name | Responsibility |
|------|----------------|
| **Alimili Nikhil Reddy** | Backend Development, Database Design, REST APIs |
| **Sanskar Kharya** | Frontend Development, UI/UX Design, Documentation |

---

# 📜 License

This project is licensed under the **MIT License**.

Feel free to use, modify and distribute this project for educational purposes.

---

# 🙏 Acknowledgements

We would like to express our gratitude to the following technologies and communities that made this project possible.

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Recharts

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- dotenv
- cors

### Database

- MongoDB
- Mongoose

### Export Libraries

- jsPDF
- jsPDF AutoTable

### Development Tools

- VS Code
- Git
- GitHub
- Postman

---

# 💡 Project Status

> **Current Status:** Completed ✅

### Completed Modules

- Authentication
- Admin Dashboard
- Student Dashboard
- Student CRUD
- Attendance Management
- Reports
- CSV Export
- PDF Export
- JWT Authentication
- Responsive UI

---

# 🎯 Learning Outcomes

Through this project, we gained practical experience in:

- MERN Stack Development
- REST API Design
- MongoDB Schema Design
- JWT Authentication
- Password Hashing using bcrypt
- React Context API
- Tailwind CSS
- Responsive Web Design
- Data Visualization with Recharts
- PDF & CSV Report Generation
- CRUD Operations
- Role-Based Access Control
- Git & GitHub Collaboration

---

# 📋 Assumptions

- Attendance can only be marked once for a student on a given date.
- Student emails and roll numbers are unique.
- Attendance status includes:
  - Present
  - Absent
  - Late
- "Late" is counted as Present for attendance percentage calculations.
- Admin accounts are created using the provided seed script.

---

# 🔒 Security Measures

- Helmet Security Headers (helmet)
- Rate Limiting (express-rate-limit)
- Input Validation
- Duplicate Attendance Prevention
- Duplicate Email/Roll Validation
- Environment Configuration
- MongoDB Compound Index validation

---

# ⚡ Load Testing

Verify 1,000+ concurrent user support:
```bash
# Install k6 locally (Windows: choco install k6, macOS: brew install k6)
# Run the load test
k6 run load-tests/k6/classtrack-load-test.js
```

---

# 🌟 Highlights

✔ MERN Stack Architecture

✔ Clean Folder Structure

✔ Modular Backend

✔ Responsive Frontend

✔ RESTful APIs

✔ JWT Authentication

✔ Secure Password Storage

✔ Attendance Analytics

✔ PDF & CSV Reports

✔ Professional Dashboard

✔ Easy to Extend

---

# 📌 Upcoming Improvements

- QR Code Attendance
- Face Recognition Attendance
- AI-Based Attendance Prediction
- Attendance Notifications
- Email Integration
- SMS Alerts
- Parent Dashboard
- Faculty Dashboard
- Dark Mode
- Multi-Institute Support
- Cloud Deployment
- Docker Support

---

# 🚀 Deployment

### Frontend

Deploy on:

- Vercel
- Netlify

### Backend

Deploy on:

- Render
- Railway

### Database

- MongoDB Atlas

---

# 📊 Load Testing & Performance Proof

ClassTrack is verified to handle **1,000+ concurrent virtual users** using [k6](https://k6.io/).

- **Script location:** [classtrack-load-test.js](load-tests/k6/classtrack-load-test.js)
- **Detailed Report & Logs:** Refer to the [Load Testing Summary Report](load-tests/results/summary.md) for latency percentiles and checks.

### Key Results Summary:
- **Peak Load:** 1,000 Concurrent VUs
- **Successful Requests:** 101,852 total request transactions
- **Error Rate:** 0.00% (No failed connections or HTTP errors)
- **Average Request Latency:** 13.12 ms (extremely fast response times under full concurrency load)
- **Total Assertions Checked:** 127,317 assertions (100.00% passed)

---

# 🧑‍💻 Contributors

## Alimili Nikhil Reddy

- Backend Development
- API Development
- MongoDB Database Design
- Authentication
- Attendance Module

---

## Sanskar Kharya

- Frontend Development
- UI/UX Design
- Dashboard Development
- Documentation
- Project Management

---

# 📄 License

Distributed under the **MIT License**.

You are free to use, modify, and distribute this project for educational and personal purposes.

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps motivate us to build more open-source projects.

---

# 📬 Contact

For suggestions, improvements, or collaboration, feel free to connect with the contributors.

---

<div align="center">

# 🎓 ClassTrack

### Smart Attendance Management Made Simple

Built with ❤️ using the MERN Stack

**React • Node.js • Express • MongoDB**

---

### Thank you for checking out our project!

⭐ **Don't forget to star the repository if you liked it!**

</div>
