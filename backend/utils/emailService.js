// backend/utils/emailService.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port,
    secure,          // true for 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

/**
 * Send a generic email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ClassTrack <noreply@classtrack.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    // If using Ethereal, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview email at:', previewUrl);
    }
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send contact form acknowledgement email
 */
const sendContactAcknowledgement = async ({ name, email, subject, message }) => {
  return sendEmail({
    to: email,
    subject: `We received your message – ClassTrack`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">ClassTrack</h1>
          <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 14px;">Student Attendance Management System</p>
        </div>
        <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 8px;">Hi ${name}, we got your message!</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
          Thank you for reaching out to the ClassTrack team. We've received your message and will get back to you within <strong>24–48 hours</strong>.
        </p>
        <div style="background: white; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Your message</p>
          <p style="color: #334155; font-style: italic; margin: 0;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          This is an automated message from ClassTrack — please do not reply directly.
        </p>
      </div>
    `,
  });
};

/**
 * Send signup welcome email
 */
const sendWelcomeEmail = async ({ name, email, role }) => {
  return sendEmail({
    to: email,
    subject: `Welcome to ClassTrack!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to ClassTrack 🎉</h1>
        </div>
        <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 8px;">Hi ${name}!</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
          Your ClassTrack account has been created successfully. You're registered as a <strong>${role}</strong>.
        </p>
        <p style="color: #475569; line-height: 1.6;">
          You can now log in and ${role === 'admin' ? 'manage students and attendance records' : 'view your attendance history and reports'}.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
             style="background: #2563eb; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Go to ClassTrack
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          This is an automated message from ClassTrack — please do not reply directly.
        </p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendContactAcknowledgement, sendWelcomeEmail };
