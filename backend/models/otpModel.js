import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'pending' },
  otp: {
    value: { type: Number },
    expiresAt: { type: Date },
  },
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
