// backend/controllers/contactController.js
const { sendContactAcknowledgement, sendEmail } = require('../utils/emailService');

// Store feedback in memory if no DB model (lightweight) — or persist to DB
const contactFeedbacks = [];

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, subject, message, category } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const entry = { name, email, subject, message, category, createdAt: new Date() };
    contactFeedbacks.push(entry);

    // Skip email sending during load tests — respond immediately for performance
    if (process.env.LOAD_TEST !== 'true') {
      // Fire-and-forget — don't await, so contact form responds instantly
      sendContactAcknowledgement({ name, email, subject: subject || 'General Enquiry', message }).catch(err =>
        console.error('Contact ACK email failed:', err.message)
      );

      if (process.env.SMTP_USER) {
        sendEmail({
          to: process.env.SMTP_USER,
          subject: `[ClassTrack] New Contact Form: ${subject || 'General Enquiry'}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Category:</strong> ${category || 'General'}</p>
              <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left:4px solid #2563eb; padding-left:12px; color:#334155;">${message}</blockquote>
            </div>
          `,
        }).catch(err => console.error('Admin notify email failed:', err.message));
      }
    }

    return res.status(201).json({ success: true, message: 'Your message has been received. We\'ll get back to you shortly.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ message: 'Failed to process your request. Please try again.' });
  }
};

// @desc    Get all feedback (admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getFeedbacks = async (req, res) => {
  return res.json(contactFeedbacks);
};

module.exports = { submitContact, getFeedbacks };
