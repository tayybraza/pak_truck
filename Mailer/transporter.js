// transporter.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer transport setup
let transporter = nodemailer.createTransport({
  service: 'gmail',  // Gmail SMTP server
  auth: {
    user: process.env.USER_EMAIL,  // Your Gmail address from .env
    pass: process.env.USER_APP_PASSWORD,  // Your Gmail app password from .env
  },
});

// Export the transporter object so it can be used in other files
module.exports = transporter;
