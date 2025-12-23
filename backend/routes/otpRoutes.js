import express from 'express';
import { requestOtp, validateOtp } from '../controllers/otpController.js';


const router = express.Router();

router.post('/request', requestOtp);
router.post('/verify', validateOtp);

export default router;
