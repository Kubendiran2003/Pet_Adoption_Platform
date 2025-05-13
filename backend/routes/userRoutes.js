import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getShelters,
  getShelterById,
  toggleSavedPet,
  getSavedPets,
  updatePreferences
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  loginUser
);

router.get('/shelters', getShelters);
router.get('/shelters/:id', getShelterById);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/savedPets', protect, toggleSavedPet);
router.get('/savedPets', protect, getSavedPets);
router.put('/preferences', protect, updatePreferences);

export default router;