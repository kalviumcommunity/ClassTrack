const express = require('express');
const router = express.Router();
const { checkAttendance, markAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Student-accessible route for personal attendance data
router.get('/student', protect, getStudentAttendance);

// Admin-only routes for checking and marking attendance
router.get('/check', protect, adminOnly, checkAttendance);
router.post('/mark', protect, adminOnly, markAttendance);

module.exports = router;
