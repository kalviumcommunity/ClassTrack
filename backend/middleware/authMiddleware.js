const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user based on role stored in JWT payload
      // Check primary models first, then fall back to generic User model
      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        // Fallback to User model (e.g., admin created via signup)
        if (!req.user) {
          req.user = await User.findById(decoded.id).select('-password');
        }
      } else if (decoded.role === 'student') {
        req.user = await Student.findById(decoded.id).select('-password');
        // Fallback to User model (e.g., student created via signup)
        if (!req.user) {
          req.user = await User.findById(decoded.id).select('-password');
        }
      } else {
        // Generic User model (shouldn't normally happen)
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Ensure role is always set on req.user
      if (!req.user.role) {
        req.user.role = decoded.role;
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, adminOnly };
