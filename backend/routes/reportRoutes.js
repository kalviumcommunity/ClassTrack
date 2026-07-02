const express = require('express');
const router = express.Router();
const { getReports, getDashboardStats } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect all report endpoints to admins only
router.use(protect);
router.use(adminOnly);

router.get('/', getReports);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
