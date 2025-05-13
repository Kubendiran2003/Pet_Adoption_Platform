import express from 'express';
import {
  createReview,
  getShelterReviews,
  getPetReviews,
  updateReview,
  deleteReview,
  addReviewResponse,
  markReviewHelpful,
  approveReview
} from '../controllers/reviewController.js';
import { protect, isShelter, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/shelter/:shelterId', getShelterReviews);
router.get('/pet/:petId', getPetReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/response', protect, isShelter, addReviewResponse);
router.post('/:id/helpful', protect, markReviewHelpful);
router.put('/:id/approve', protect, isAdmin, approveReview);

export default router;