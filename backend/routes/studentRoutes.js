const express = require('express');
const router = express.Router();
const { getStudents, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect all student routes for admins only
router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
