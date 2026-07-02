# 🎓 Student Attendance Management System

A modern web-based **Student Attendance Management System** that simplifies attendance tracking for educational institutions. The application enables teachers to manage attendance efficiently while allowing students to monitor their attendance records and overall attendance percentage through an intuitive dashboard.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Overview](#-api-overview)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

# 📌 Overview

Managing student attendance manually is time-consuming and prone to errors. This project provides a centralized platform where teachers can record attendance digitally while students can view their attendance statistics and history in real time.

The system is designed with simplicity, scalability, and ease of use in mind.

---

# ✨ Features

## 👨‍🏫 Teacher Module

- Secure Login
- Dashboard
- Manage Students
- Create & Manage Classes
- Mark Attendance
- View Attendance Records
- Attendance Percentage Tracking
- Search Students
- Filter Attendance by Date

## 👨‍🎓 Student Module

- Secure Login
- View Attendance Dashboard
- Attendance Percentage
- Attendance History
- View Class Details

## 🌟 General Features

- JWT Authentication
- Responsive Design
- RESTful APIs
- MongoDB Database
- Clean Dashboard
- Mobile Friendly
- Attendance Analytics

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Axios

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JSON Web Token (JWT)
- bcrypt.js

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 🏗 System Architecture

```text
                React Frontend
                       │
                       │ REST API
                       ▼
               Express.js Backend
                       │
                       ▼
                  MongoDB Database
```

---

# 📂 Project Structure

```text
student-attendance-management/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# ⚙ Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/student-attendance-management.git
```

```bash
cd student-attendance-management
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd ../server
npm install
```

---

# ▶️ Running the Project

## Start Backend

```bash
npm run dev
```

## Start Frontend

```bash
cd ../client
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

The backend will run on:

```
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# 🚀 Usage

### Teacher

- Login
- Create Classes
- Add Students
- Mark Attendance
- View Attendance Reports
- Track Student Attendance Percentage

### Student

- Login
- View Attendance Dashboard
- View Attendance History
- Check Attendance Percentage

---

# 🌐 API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Students

```http
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

## Attendance

```http
POST /api/attendance
GET  /api/attendance
GET  /api/attendance/:studentId
```

---

# 🗄 Database Schema

## User

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedPassword",
  "role": "teacher"
}
```

## Student

```json
{
  "_id": "...",
  "name": "Jane Doe",
  "rollNumber": "22CS101",
  "department": "Computer Science",
  "semester": 4
}
```

## Attendance

```json
{
  "_id": "...",
  "studentId": "...",
  "classId": "...",
  "date": "2026-07-02",
  "status": "Present"
}
```

---

# 📊 Key Functionalities

- Student Management
- Attendance Tracking
- Attendance History
- Attendance Percentage Calculation
- Secure Authentication
- Dashboard Analytics
- Search & Filter Students

---

# 📸 Screenshots

Add screenshots after completing the project.

```text
screenshots/
├── login.png
├── teacher-dashboard.png
├── student-dashboard.png
├── attendance.png
└── reports.png
```

---

# 🚀 Future Improvements

- QR Code Based Attendance
- Face Recognition
- Email Notifications
- CSV/PDF Report Export
- Parent Portal
- Admin Dashboard
- Mobile Application
- Real-Time Notifications
- AI Attendance Analytics

---

# 🤝 Contributors

| Name | Role |
|------|------|
| **Alimili Nikhil Reddy** | Backend Developer |
| **Sanskar Kharya** | Frontend Developer |

---

# 📄 License

This project is licensed under the **MIT License**.

---

# ⭐ Acknowledgements

- Hackathon Organizers
- Open Source Community
- React.js
- Node.js
- Express.js
- MongoDB
- Tailwind CSS

---

## 💡 Project Status

> ✅ Completed for Hackathon Submission

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ by **Alimili Nikhil Reddy** & **Sanskar Kharya**

</div>
