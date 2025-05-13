import asyncHandler from '../utils/asyncHandler.js';
import Application from '../models/applicationModel.js';
import Pet from '../models/petModel.js';
import emailService from '../utils/emailService.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';

/**
 * @desc    Create new adoption application
 * @route   POST /api/applications
 * @access  Private
 */
export const createApplication = asyncHandler(async (req, res) => {
  const { pet: petId, ...applicationData } = req.body;
  
  // Check if pet exists and is available
  const pet = await Pet.findById(petId);
  
  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }
  
  if (pet.status !== 'Available') {
    res.status(400);
    throw new Error('This pet is not available for adoption');
  }
  
  // Check if user already has an application for this pet
  const existingApplication = await Application.findOne({
    user: req.user._id,
    pet: petId
  });
  
  if (existingApplication) {
    res.status(400);
    throw new Error('You already have an application for this pet');
  }
  
  // Create application
  const application = await Application.create({
    user: req.user._id,
    pet: petId,
    shelter: pet.shelter,
    ...applicationData
  });
  
  // Create a conversation for this application
  const conversation = await Conversation.create({
    participants: [req.user._id, pet.shelter],
    subject: `Application for ${pet.name}`,
    relatedTo: {
      pet: petId,
      application: application._id
    }
  });
  
  // Add initial message
  await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    content: `I've submitted an application to adopt ${pet.name}. Please review my application and let me know if you need any additional information.`
  });
  
  res.status(201).json(application);
});

/**
 * @desc    Get user's applications
 * @route   GET /api/applications/user
 * @access  Private
 */
export const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate('pet', 'name photos species breed age status')
    .populate('shelter', 'name email')
    .sort('-createdAt');
  
  res.json(applications);
});

/**
 * @desc    Get shelter's applications
 * @route   GET /api/applications/shelter
 * @access  Private/Shelter
 */
export const getShelterApplications = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Build filter query
  let query = { shelter: req.user._id };
  
  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Filter by pet
  if (req.query.pet) {
    query.pet = req.query.pet;
  }
  
  // Count total
  const total = await Application.countDocuments(query);
  
  // Get applications
  const applications = await Application.find(query)
    .populate('pet', 'name photos species breed status')
    .populate('user', 'name email')
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort || '-createdAt');
  
  res.json({
    success: true,
    count: applications.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: applications
  });
});

/**
 * @desc    Get application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('pet', 'name photos species breed age status')
    .populate('shelter', 'name email phone address')
    .populate('user', 'name email');
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  // Check if user is authorized to view this application
  const isUser = req.user._id.toString() === application.user._id.toString();
  const isShelter = req.user._id.toString() === application.shelter._id.toString();
  
  if (!isUser && !isShelter && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this application');
  }
  
  res.json(application);
});

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private/Shelter
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  
  const application = await Application.findById(req.params.id)
    .populate('pet', 'name status')
    .populate('user', 'name email');
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  // Check if shelter owns this application
  if (application.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }
  
  // Update application status
  application.status = status;
  
  // Add note if message provided
  if (message) {
    application.notes.push({
      content: message,
      createdBy: req.user._id
    });
  }
  
  // If approved, update pet status to Pending
  if (status === 'Approved' && application.pet.status === 'Available') {
    await Pet.findByIdAndUpdate(application.pet._id, { status: 'Pending' });
  }
  
  await application.save();
  
  // Send email notification to user
  await emailService.sendApplicationStatusUpdate({
    email: application.user.email,
    name: application.user.name,
    petName: application.pet.name,
    status,
    message
  });
  
  res.json({
    success: true,
    status: application.status,
    message: `Application marked as ${status}`
  });
});

/**
 * @desc    Add note to application
 * @route   POST /api/applications/:id/notes
 * @access  Private
 */
export const addApplicationNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    res.status(400);
    throw new Error('Note content is required');
  }
  
  const application = await Application.findById(req.params.id);
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  // Check if user is authorized to add notes
  const isUser = req.user._id.toString() === application.user.toString();
  const isShelter = req.user._id.toString() === application.shelter.toString();
  
  if (!isUser && !isShelter && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to add notes to this application');
  }
  
  // Add note
  application.notes.push({
    content,
    createdBy: req.user._id
  });
  
  await application.save();
  
  res.json({
    success: true,
    notes: application.notes
  });
});

/**
 * @desc    Schedule a meeting
 * @route   POST /api/applications/:id/meeting
 * @access  Private/Shelter
 */
export const scheduleMeeting = asyncHandler(async (req, res) => {
  const { date, location, notes } = req.body;
  
  if (!date || !location) {
    res.status(400);
    throw new Error('Date and location are required');
  }
  
  const application = await Application.findById(req.params.id)
    .populate('user', 'name email')
    .populate('pet', 'name');
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  // Check if shelter owns this application
  if (application.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to schedule a meeting for this application');
  }
  
  // Update meeting info
  application.meetingScheduled = {
    isScheduled: true,
    date: new Date(date),
    location,
    notes
  };
  
  await application.save();
  
  // Send email notification
  await emailService.sendApplicationStatusUpdate({
    email: application.user.email,
    name: application.user.name,
    petName: application.pet.name,
    status: `Meet and Greet scheduled for ${new Date(date).toLocaleString()}`,
    message: `Location: ${location}\n${notes || ''}`
  });
  
  res.json({
    success: true,
    meeting: application.meetingScheduled
  });
});

/**
 * @desc    Withdraw application
 * @route   PUT /api/applications/:id/withdraw
 * @access  Private
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  // Check if user owns this application
  if (application.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to withdraw this application');
  }
  
  // Update application status
  application.status = 'Withdrawn';
  await application.save();
  
  res.json({
    success: true,
    message: 'Application withdrawn successfully'
  });
});