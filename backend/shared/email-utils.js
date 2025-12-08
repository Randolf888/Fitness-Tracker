const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD
  }
});

const sendEmail = async (to, subject, message) => {
  if (!to) {
    throw new Error('Recipient email (to) is required.');
  }

  if (!subject) {
    throw new Error('Email subject is required.');
  }

  if (!message) {
    throw new Error('Email message is required.');
  }

  try {
    await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,
      subject,
      text: message
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
