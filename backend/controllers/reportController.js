const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Get detailed attendance reports and statistics
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  const { studentId, department, year, section, startDate, endDate } = req.query;

  try {
    // 1. Build Student Match Filter
    const studentQuery = {};
    if (studentId) {
      studentQuery._id = studentId;
    } else {
      if (department) studentQuery.department = department;
      if (year) studentQuery.year = year;
      if (section) studentQuery.section = section;
    }

    // Fetch relevant students
    const students = await Student.find(studentQuery).select('name rollNumber department year section email phone');
    if (students.length === 0) {
      return res.json({
        records: [],
        stats: {
          totalStudents: 0,
          totalRecords: 0,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          attendancePercentage: 0
        }
      });
    }

    const studentIds = students.map(s => s._id);

    // 2. Build Attendance Filter
    const attendanceQuery = { studentId: { $in: studentIds } };
    
    if (startDate || endDate) {
      attendanceQuery.date = {};
      if (startDate) {
        attendanceQuery.date.$gte = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      }
      if (endDate) {
        attendanceQuery.date.$lte = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
      }
    }

    // Fetch records
    const records = await Attendance.find(attendanceQuery)
      .populate('studentId', 'name rollNumber department year section')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // Compile statistics
    const totalRecords = records.length;
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;
    const lateCount = records.filter(r => r.status === 'Late').length;

    // Attendance rate calculation (count Late as present for rate)
    const attended = presentCount + lateCount;
    const attendancePercentage = totalRecords > 0
      ? Math.round((attended / totalRecords) * 100)
      : 100;

    return res.json({
      records,
      stats: {
        totalStudents: students.length,
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return res.status(500).json({ message: 'Server error compiling report' });
  }
};

// @desc    Get dashboard aggregate stats for Admin
// @route   GET /api/reports/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(new Date(todayStr).setUTCHours(0, 0, 0, 0));

    // 1. Total Students
    const totalStudents = await Student.countDocuments();

    // 2. Today's Attendance records
    const todayRecords = await Attendance.find({ date: today });
    const presentToday = todayRecords.filter(r => r.status === 'Present').length;
    const absentToday = todayRecords.filter(r => r.status === 'Absent').length;
    const lateToday = todayRecords.filter(r => r.status === 'Late').length;

    // 3. Overall Attendance rate across all time
    const allRecords = await Attendance.find({});
    const totalAll = allRecords.length;
    const presentAll = allRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const overallPercentage = totalAll > 0 ? Math.round((presentAll / totalAll) * 100) : 100;

    // 4. Recent attendance trends for Recharts (past 7 calendar days)
    const recentDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.setUTCHours(0, 0, 0, 0));
      recentDays.push(startOfDay);
    }

    const trends = await Promise.all(recentDays.map(async (dayDate) => {
      const dayRecords = await Attendance.find({ date: dayDate });
      const present = dayRecords.filter(r => r.status === 'Present').length;
      const late = dayRecords.filter(r => r.status === 'Late').length;
      const absent = dayRecords.filter(r => r.status === 'Absent').length;
      
      // UTC-safe localized label
      const dateString = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

      return {
        date: dateString,
        Present: present,
        Late: late,
        Absent: absent,
        Total: dayRecords.length
      };
    }));

    return res.json({
      totalStudents,
      presentToday: presentToday + lateToday,
      absentToday,
      lateToday,
      overallPercentage,
      trends
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getReports, getDashboardStats };
