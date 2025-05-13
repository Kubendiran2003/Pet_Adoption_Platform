import express from 'express';
import {
  getUserConversations,
  getConversationById,
  createConversation,
  sendMessage,
  archiveConversation,
  getUnreadMessageCount
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.get('/conversations', protect, getUserConversations);
router.get('/conversations/:id', protect, getConversationById);
router.post('/conversations', protect, createConversation);
router.post('/conversations/:id', protect, sendMessage);
router.delete('/conversations/:id', protect, archiveConversation);
router.get('/unread', protect, getUnreadMessageCount);

export default router;