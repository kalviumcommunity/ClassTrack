const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  }
}, {
  timestamps: true,
});

// Unique compound index on studentId and date to enforce duplicate prevention in MongoDB
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
