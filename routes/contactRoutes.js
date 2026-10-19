import express from 'express';
import {
  submitContact,
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.route('/')
  .post(contactLimiter, submitContact)
  .get(protect, getMessages);

router.route('/:id/read')
  .patch(protect, markMessageRead);

router.route('/:id')
  .delete(protect, deleteMessage);

export default router;
