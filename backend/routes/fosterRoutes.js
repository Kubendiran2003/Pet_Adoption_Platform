import express from 'express';
import {
  createFosterApplication,
  getUserFosterApplications,
  getShelterFosterApplications,
  getFosterApplicationById,
  updateFosterStatus,
  scheduleHomeCheck,
  completeHomeCheck,
  submitFosterFeedback
} from '../controllers/fosterController.js';
import { protect, isShelter } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createFosterApplication);
router.get('/user', protect, getUserFosterApplications);
router.get('/shelter', protect, isShelter, getShelterFosterApplications);
router.get('/:id', protect, getFosterApplicationById);
router.put('/:id/status', protect, isShelter, updateFosterStatus);
router.post('/:id/homecheck', protect, isShelter, scheduleHomeCheck);
router.put('/:id/homecheck', protect, isShelter, completeHomeCheck);
router.post('/:id/feedback', protect, submitFosterFeedback);

export default router;