import express from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, createSkill);

router.route('/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

export default router;
