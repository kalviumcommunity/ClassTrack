// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { submitContact, getFeedbacks } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public: submit contact form
router.post('/', submitContact);

// Admin only: view all feedback submissions
router.get('/', protect, adminOnly, getFeedbacks);

module.exports = router;
