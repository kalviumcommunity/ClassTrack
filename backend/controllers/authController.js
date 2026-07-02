const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const { sendWelcomeEmail } = require('../utils/emailService');

// Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Try finding admin first
    let user = await Admin.findOne({ email });
    let role = 'admin';

    // If not admin, find student
    if (!user) {
      user = await Student.findOne({ email });
      role = 'student';
    }

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        token: generateToken(user._id, role),
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        section: user.section,
        phone: user.phone,
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role = 'student', rollNumber, department, year, section, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const formattedEmail = email.toLowerCase().trim();

    // Check for existing user in all collections
    const existingAdmin = await Admin.findOne({ email: formattedEmail });
    const existingStudent = await Student.findOne({ email: formattedEmail });

    if (existingAdmin || existingStudent) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    let newUser;

    if (role === 'admin') {
      newUser = await Admin.create({
        name,
        email: formattedEmail,
        password,
      });
    } else {
      if (!rollNumber || !department || !year || !section || !phone) {
        return res.status(400).json({ message: 'All student fields (Roll Number, Department, Year, Section, Phone) are required' });
      }

      const formattedRoll = rollNumber.toUpperCase().trim();
      const existingRoll = await Student.findOne({ rollNumber: formattedRoll });
      if (existingRoll) {
        return res.status(400).json({ message: 'Student with that Roll Number already exists' });
      }

      newUser = await Student.create({
        name,
        email: formattedEmail,
        password,
        rollNumber: formattedRoll,
        department,
        year,
        section,
        phone,
      });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name, email: newUser.email, role: newUser.role }).catch(err =>
      console.error('Welcome email failed:', err.message)
    );

    const token = generateToken(newUser._id, newUser.role);
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
      rollNumber: newUser.rollNumber,
      department: newUser.department,
      year: newUser.year,
      section: newUser.section,
      phone: newUser.phone,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch actual DB instance based on role
    let userInstance;
    if (user.role === 'admin') {
      userInstance = await Admin.findById(user._id);
    } else {
      userInstance = await Student.findById(user._id);
    }

    if (userInstance) {
      userInstance.name = req.body.name || userInstance.name;

      // Check if email is already taken if changed
      if (req.body.email && req.body.email !== userInstance.email) {
        const adminExists = await Admin.findOne({ email: req.body.email.toLowerCase() });
        const studentExists = await Student.findOne({ email: req.body.email.toLowerCase() });
        if (adminExists || studentExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        userInstance.email = req.body.email.toLowerCase();
      }

      // Update phone if student
      if (user.role === 'student') {
        userInstance.phone = req.body.phone || userInstance.phone;
      }

      if (req.body.password) {
        userInstance.password = req.body.password;
      }

      const updatedUser = await userInstance.save();

      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id, updatedUser.role),
        rollNumber: updatedUser.rollNumber,
        department: updatedUser.department,
        year: updatedUser.year,
        section: updatedUser.section,
        phone: updatedUser.phone,
      });
    } else {
      return res.status(404).json({ message: 'User instance not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser, registerUser, getUserProfile, updateUserProfile };
