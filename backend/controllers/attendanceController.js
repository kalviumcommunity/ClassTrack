const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Check attendance and fetch student list for a class on a date
// @route   GET /api/attendance/check
// @access  Private/Admin
const checkAttendance = async (req, res) => {
  const { date, department, year, section } = req.query;

  try {
    if (!date || !department || !year || !section) {
      return res.status(400).json({ message: 'Missing date, department, year, or section parameter' });
    }

    // Normalize date to UTC midnight
    const searchDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));

    // 1. Fetch all students in the class
    const students = await Student.find({ department, year, section }).sort({ rollNumber: 1 });

    if (students.length === 0) {
      return res.json({ students: [], records: [], isMarked: false });
    }

    // 2. Fetch existing attendance records for these students on that date
    const studentIds = students.map(s => s._id);
    const existingRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date: searchDate
    });

    const isMarked = existingRecords.length > 0;

    return res.json({
      students,
      records: existingRecords,
      isMarked
    });
  } catch (error) {
    console.error('Check attendance error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark or update attendance for students in a class
// @route   POST /api/attendance/mark
// @access  Private/Admin
const markAttendance = async (req, res) => {
  const { date, records } = req.body;

  try {
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Date and records array are required' });
    }

    // Normalize date to UTC midnight
    const targetDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));

    // Prepare bulk operations to upsert (insert or update status if duplicate)
    const bulkOps = records.map(rec => ({
      updateOne: {
        filter: { studentId: rec.studentId, date: targetDate },
        update: {
          $set: {
            status: rec.status,
            markedBy: req.user._id
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);
    }

    return res.json({ message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    return res.status(500).json({ message: 'Server error saving attendance' });
  }
};

// @desc    Get current student's personal attendance history and statistics
// @route   GET /api/attendance/student
// @access  Private (Student only)
const getStudentAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    // Find the Student document — could be logged in via Student model OR via User model
    let studentDoc = null;

    // Try direct ID lookup first (Student model users)
    studentDoc = await Student.findById(req.user._id);

    // If not found, look up by email (User-model students who signed up)
    if (!studentDoc && req.user.email) {
      studentDoc = await Student.findOne({ email: req.user.email });
    }

    // If still not found in the Student collection, return empty but valid data
    if (!studentDoc) {
      return res.json({
        records: [],
        stats: {
          totalClasses: 0,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          attendancePercentage: 100
        },
        message: 'No attendance records found. Your attendance will appear here once marked by the admin.'
      });
    }

    // Fetch all attendance records for this student
    const records = await Attendance.find({ studentId: studentDoc._id })
      .sort({ date: -1 })
      .populate('markedBy', 'name');

    // Compile statistics
    const totalClasses = records.length;
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;
    const lateCount = records.filter(r => r.status === 'Late').length;

    // Present + Late count as attended
    const attendedCount = presentCount + lateCount;
    const attendancePercentage = totalClasses > 0
      ? Math.round((attendedCount / totalClasses) * 100)
      : 100;

    return res.json({
      records,
      stats: {
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage
      },
      student: {
        name: studentDoc.name,
        rollNumber: studentDoc.rollNumber,
        department: studentDoc.department,
        year: studentDoc.year,
        section: studentDoc.section
      }
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkAttendance, markAttendance, getStudentAttendance };
