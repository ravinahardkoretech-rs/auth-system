const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("VERIFY ERROR:", err);
  } else {
    console.log("Mail server ready");
  }
});

transporter.sendMail(
  {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Test Email",
    text: "Nodemailer is working",
  },
  (err, info) => {
    if (err) {
      console.log("SEND ERROR:", err);
    } else {
      console.log("EMAIL SENT:", info.response);
    }
  }
);