const nodemailer = require('nodemailer')

// SMTP transport configured from environment variables.
// Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in your .env.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Send an email. `to`, `subject` and one of `text`/`html` are required.
const sendMail = ({ to, subject, text, html }) =>
  transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  })

module.exports = { transporter, sendMail }
