import express from 'express';
import { isUserAuth } from '../middleware/UserAuth.js';
import { checkOut, paymentVerification } from '../controller/paymentController.js';
const router = express.Router();
router.post('/checkout', isUserAuth, checkOut);
router.post('/verify', isUserAuth, paymentVerification);
export default router;
