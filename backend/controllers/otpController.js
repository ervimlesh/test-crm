import { createOtp, verifyOtp } from '../services/otpService.js';

const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    await createOtp(email);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const validateOtp = async (req, res) => {
  const { email, otp } = req.body; 

  try {
    const isValid = await verifyOtp(email, otp);
    res.status(200).json({ message: 'OTP validated successfully', isValid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { requestOtp, validateOtp };
