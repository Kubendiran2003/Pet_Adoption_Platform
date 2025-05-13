import asyncHandler from '../utils/asyncHandler.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import emailService from '../utils/emailService.js';

/**
 * @desc    Get user conversations
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getUserConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
    isActive: true
  })
    .populate('participants', 'name email role')
    .populate('lastMessage')
    .populate('relatedTo.pet', 'name photos')
    .sort('-updatedAt');

  res.json(conversations);
});

/**
 * @desc    Get conversation by ID
 * @route   GET /api/messages/conversations/:id
 * @access  Private
 */
export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('participants', 'name email role')
    .populate('relatedTo.pet', 'name photos')
    .populate('relatedTo.application');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to view this conversation');
  }

  // Get messages
  const messages = await Message.find({ conversation: conversation._id })
    .populate('sender', 'name')
    .sort('createdAt');

  // Mark messages as read
  await Message.updateMany(
    {
      conversation: conversation._id,
      sender: { $ne: req.user._id },
      'readBy.user': { $ne: req.user._id }
    },
    {
      $push: {
        readBy: {
          user: req.user._id,
          readAt: new Date()
        }
      }
    }
  );

  res.json({
    conversation,
    messages
  });
});

/**
 * @desc    Create a new conversation
 * @route   POST /api/messages/conversations
 * @access  Private
 */
export const createConversation = asyncHandler(async (req, res) => {
  const { recipient, subject, petId, applicationId, initialMessage } = req.body;

  if (!recipient || !initialMessage) {
    res.status(400);
    throw new Error('Recipient and initial message are required');
  }

  // Check if conversation already exists
  const existingConversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipient] },
    ...(petId && { 'relatedTo.pet': petId }),
    isActive: true
  });

  if (existingConversation) {
    // Add new message to existing conversation
    const message = await Message.create({
      conversation: existingConversation._id,
      sender: req.user._id,
      content: initialMessage
    });

    // Update last message in conversation
    existingConversation.lastMessage = message._id;
    await existingConversation.save();

    res.status(200).json({
      success: true,
      conversationId: existingConversation._id,
      message: 'Message sent to existing conversation'
    });
    
    return;
  }

  // Create new conversation
  const conversation = await Conversation.create({
    participants: [req.user._id, recipient],
    subject: subject || 'No Subject',
    relatedTo: {
      ...(petId && { pet: petId }),
      ...(applicationId && { application: applicationId })
    }
  });

  // Create initial message
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    content: initialMessage
  });

  // Update conversation with last message
  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json({
    success: true,
    conversationId: conversation._id,
    message: 'Conversation created and message sent'
  });
});

/**
 * @desc    Send a message to a conversation
 * @route   POST /api/messages/conversations/:id
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, attachments } = req.body;
  const conversationId = req.params.id;

  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
  }

  const conversation = await Conversation.findById(conversationId)
    .populate('participants', 'name email');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to send messages to this conversation');
  }

  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
    ...(attachments && { attachments })
  });

  // Update conversation's last message and time
  conversation.lastMessage = message._id;
  await conversation.save();

  // Get recipient(s)
  const recipients = conversation.participants.filter(
    p => p._id.toString() !== req.user._id.toString()
  );

  // Send email notification to recipients
  for (const recipient of recipients) {
    await emailService.sendMessageNotification({
      email: recipient.email,
      name: recipient.name,
      senderName: req.user.name,
      subject: conversation.subject
    });
  }

  res.status(201).json(message);
});

/**
 * @desc    Mark conversation as inactive/archived
 * @route   DELETE /api/messages/conversations/:id
 * @access  Private
 */
export const archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.includes(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to archive this conversation');
  }

  // Archive conversation
  conversation.isActive = false;
  await conversation.save();

  res.json({
    success: true,
    message: 'Conversation archived'
  });
});

/**
 * @desc    Get unread message count
 * @route   GET /api/messages/unread
 * @access  Private
 */
export const getUnreadMessageCount = asyncHandler(async (req, res) => {
  // Get all conversations where user is a participant
  const conversations = await Conversation.find({
    participants: req.user._id,
    isActive: true
  });

  const conversationIds = conversations.map(c => c._id);

  // Count unread messages
  const unreadCount = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: req.user._id },
    'readBy.user': { $ne: req.user._id }
  });

  res.json({
    unreadCount
  });
});