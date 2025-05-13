import express from 'express';
import {
  createApplication,
  getUserApplications,
  getShelterApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  scheduleMeeting,
  withdrawApplication
} from '../controllers/applicationController.js';
import { protect, isShelter } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createApplication);
router.get('/user', protect, getUserApplications);
router.get('/shelter', protect, isShelter, getShelterApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, isShelter, updateApplicationStatus);
router.post('/:id/notes', protect, addApplicationNote);
router.post('/:id/meeting', protect, isShelter, scheduleMeeting);
router.put('/:id/withdraw', protect, withdrawApplication);

export default router;