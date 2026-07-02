const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/classtrack';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // Look for default admin
    const adminExists = await Admin.findOne({ email: 'admin@classtrack.com' });

    if (!adminExists) {
      const admin = new Admin({
        name: 'System Admin',
        email: 'admin@classtrack.com',
        password: 'Admin@123', // Will be hashed by pre-save hooks
      });

      await admin.save();
      console.log('==========================================');
      console.log('ClassTrack Database Seed Success!');
      console.log('Default Admin Account Created:');
      console.log('Email:    admin@classtrack.com');
      console.log('Password: Admin@123');
      console.log('==========================================');
    } else {
      console.log('Admin account (admin@classtrack.com) already exists. Skipping seed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failure:', error.message);
    process.exit(1);
  }
};

seedDB();
