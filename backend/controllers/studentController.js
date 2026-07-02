const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Attendance = require('../models/Attendance');

// @desc    Get all students (with search, filters, sorting, and pagination)
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const { search, department, year, section, page = 1, limit = 10, sortBy = 'rollNumber', order = 'asc' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) query.department = department;
    if (year) query.year = year;
    if (section) query.section = section;

    const count = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-password'); // Exclude hashed passwords from retrieval

    return res.json({
      students,
      page: Number(page),
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    console.error('Get students error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  const { name, rollNumber, department, year, section, email, phone } = req.body;

  try {
    if (!name || !rollNumber || !department || !year || !section || !email || !phone) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Validate email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const formattedRoll = rollNumber.toUpperCase().trim();
    const formattedEmail = email.toLowerCase().trim();

    // Check duplicate roll number
    const rollExists = await Student.findOne({ rollNumber: formattedRoll });
    if (rollExists) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    // Check duplicate email in both collections
    const studentEmailExists = await Student.findOne({ email: formattedEmail });
    const adminEmailExists = await Admin.findOne({ email: formattedEmail });
    if (studentEmailExists || adminEmailExists) {
      return res.status(400).json({ message: 'Email address already exists' });
    }

    // Default password is rollNumber (which will be hashed by schema pre-save hook)
    const student = await Student.create({
      name,
      rollNumber: formattedRoll,
      department,
      year,
      section,
      email: formattedEmail,
      phone,
      password: formattedRoll,
    });

    if (student) {
      return res.status(201).json({
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        year: student.year,
        section: student.section,
        email: student.email,
        phone: student.phone,
      });
    } else {
      return res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error('Create student error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  const { name, rollNumber, department, year, section, email, phone } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check roll number uniqueness if changing
    if (rollNumber) {
      const formattedRoll = rollNumber.toUpperCase().trim();
      if (formattedRoll !== student.rollNumber) {
        const rollExists = await Student.findOne({ rollNumber: formattedRoll });
        if (rollExists) {
          return res.status(400).json({ message: 'Roll number already exists' });
        }
        student.rollNumber = formattedRoll;
      }
    }

    // Check email uniqueness if changing
    if (email) {
      const formattedEmail = email.toLowerCase().trim();
      if (formattedEmail !== student.email) {
        const studentEmailExists = await Student.findOne({ email: formattedEmail });
        const adminEmailExists = await Admin.findOne({ email: formattedEmail });
        if (studentEmailExists || adminEmailExists) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        student.email = formattedEmail;
      }
    }

    student.name = name || student.name;
    student.department = department || student.department;
    student.year = year || student.year;
    student.section = section || student.section;
    student.phone = phone || student.phone;

    const updatedStudent = await student.save();

    return res.json({
      _id: updatedStudent._id,
      name: updatedStudent.name,
      rollNumber: updatedStudent.rollNumber,
      department: updatedStudent.department,
      year: updatedStudent.year,
      section: updatedStudent.section,
      email: updatedStudent.email,
      phone: updatedStudent.phone,
    });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete cascading attendance records to keep database consistent
    await Attendance.deleteMany({ studentId: req.params.id });
    await Student.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Student and related attendance history deleted' });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
