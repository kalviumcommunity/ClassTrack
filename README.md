🎓 Student Attendance Management System

A modern web-based Student Attendance Management System that simplifies attendance tracking for educational institutions. The application enables teachers to manage attendance efficiently while allowing students to monitor their attendance records and overall percentage through an intuitive dashboard.

📖 Table of Contents
Overview
Features
Tech Stack
System Architecture
Project Structure
Installation
Environment Variables
Usage
API Overview
Database Schema
Screenshots
Future Improvements
Contributors
License
📌 Overview

Managing student attendance manually is time-consuming and prone to errors. This project provides a centralized platform where teachers can record attendance digitally while students can view their attendance statistics and history in real time.

The system is designed with simplicity, scalability, and ease of use in mind.

✨ Features
Teacher Module
Secure Login
Dashboard
Manage Students
Create and Manage Classes
Mark Attendance
View Attendance Records
Attendance Percentage Tracking
Search Students
Filter Attendance by Date
Student Module
Secure Login
View Attendance
Attendance Percentage
Attendance History
Student Dashboard
General Features
Authentication
Responsive UI
REST API
MongoDB Database
Clean Dashboard
Mobile-Friendly Design
🛠 Tech Stack
Frontend
React.js
Tailwind CSS
React Router
Axios
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
JSON Web Token (JWT)
bcrypt
Tools
Git
GitHub
Postman
VS Code
🏗 System Architecture
                React Frontend
                       │
                       │ REST API
                       ▼
               Express.js Backend
                       │
                       ▼
                  MongoDB Database
📂 Project Structure
student-attendance-management/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
⚙ Installation
Clone the Repository
git clone https://github.com/yourusername/student-attendance-management.git
cd student-attendance-management
Install Frontend
cd client
npm install
Install Backend
cd ../server
npm install
Run Backend
npm run dev
Run Frontend
cd ../client
npm run dev
🔐 Environment Variables

Create a .env file inside the server directory.

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
🚀 Usage
Teacher
Login
Create a class
Add students
Mark attendance
View attendance reports
Student
Login
View attendance history
Check attendance percentage
Monitor attendance status
🌐 API Overview
Authentication
POST /api/auth/register

POST /api/auth/login
Students
GET    /api/students

POST   /api/students

PUT    /api/students/:id

DELETE /api/students/:id
Attendance
POST /api/attendance

GET  /api/attendance

GET  /api/attendance/:studentId
🗄 Database Schema
User
{
  _id,
  name,
  email,
  password,
  role
}
Student
{
  _id,
  name,
  rollNumber,
  department,
  semester
}
Attendance
{
  _id,
  studentId,
  classId,
  date,
  status
}
📊 Key Functionalities
Student Management
Attendance Tracking
Attendance Percentage Calculation
Secure Authentication
Dashboard Analytics
Attendance History
📸 Screenshots

Add screenshots of the following pages:

Login Page
Teacher Dashboard
Student Dashboard
Attendance Page
Attendance Reports

Example:

screenshots/
├── login.png
├── dashboard.png
├── attendance.png
└── reports.png
🚀 Future Improvements
QR Code Attendance
Face Recognition
Email Notifications
Attendance Export (CSV/PDF)
Parent Portal
Admin Dashboard
Mobile Application
Real-time Notifications
Advanced Analytics
🤝 Contributors
Alimili Nikhil Reddy
Sanskar Kharya
📄 License

This project is licensed under the MIT License.

⭐ Acknowledgements
Hackathon Organizers
Open Source Community
React
Node.js
Express.js
MongoDB
💡 Project Status

✅ Completed for Hackathon Submission

Made with ❤️ for learning, collaboration, and simplifying attendance management.
