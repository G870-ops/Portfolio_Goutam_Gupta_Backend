import express from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, loginAdmin);
router.get('/me', protect, getAdminProfile);

export default router;
