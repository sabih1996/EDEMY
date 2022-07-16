const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };
  const info = await transporter.sendMail(message);
};

module.exports = sendEmail;
