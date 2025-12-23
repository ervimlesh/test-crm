import nodemailer from 'nodemailer';
import OTP from '../models/otpModel.js';
import crypto from 'crypto';

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error('Failed to send OTP email');
  }
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const createOtp = async (email) => {
  const otp = generateOtp();
  
  const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRATION * 60000);

  const otpData = new OTP({
    email,
    otp,
    expiresAt,
  });

  await otpData.save();
  await sendOtpEmail(email, otp);
};

const verifyOtp = async (email, otp) => {
  const otpData = await OTP.findOne({ email, otp });

  if (!otpData) {
    throw new Error('Invalid OTP');
  }

  if (otpData.expiresAt < new Date()) {
    throw new Error('OTP has expired');
  }

  return true;
};

export { createOtp, verifyOtp };
