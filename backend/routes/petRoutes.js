import express from 'express';
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  getPetsByShelter,
  updatePetPhotos,
  updatePetStatus,
  searchPets
} from '../controllers/petController.js';
import { protect, isShelter } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPets);
router.get('/search', searchPets);
router.get('/shelter/:shelterId', getPetsByShelter);
router.get('/:id', getPetById);

// Protected routes
router.post('/', protect, isShelter, createPet);
router.put('/:id', protect, isShelter, updatePet);
router.delete('/:id', protect, isShelter, deletePet);
router.put(
  '/:id/photos',
  protect,
  isShelter,
  upload.array('photos', 5),
  updatePetPhotos
);
router.put('/:id/status', protect, isShelter, updatePetStatus);

export default router;