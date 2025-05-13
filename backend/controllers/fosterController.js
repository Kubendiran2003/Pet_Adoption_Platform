import asyncHandler from '../utils/asyncHandler.js';
import FosterApplication from '../models/fosterModel.js';
import Pet from '../models/petModel.js';
import emailService from '../utils/emailService.js';
import User from '../models/userModel.js';

/**
 * @desc    Create a foster application
 * @route   POST /api/fosters
 * @access  Private
 */
export const createFosterApplication = asyncHandler(async (req, res) => {
  const { pet: petId, startDate, endDate, notes } = req.body;

  // Check if pet exists and is available for fostering
  const pet = await Pet.findOne({
    _id: petId,
    'fosterInfo.availableForFostering': true,
    status: { $in: ['Available', 'Fostered'] }
  });

  if (!pet) {
    res.status(404);
    throw new Error('Pet not found or not available for fostering');
  }

  // Check if user already has a pending application for this pet
  const existingApplication = await FosterApplication.findOne({
    user: req.user._id,
    pet: petId,
    status: 'Pending'
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You already have a pending foster application for this pet');
  }

  // Create application
  const application = await FosterApplication.create({
    user: req.user._id,
    pet: petId,
    shelter: pet.shelter,
    startDate,
    endDate,
    notes
  });

  res.status(201).json(application);
});

/**
 * @desc    Get foster applications for a user
 * @route   GET /api/fosters/user
 * @access  Private
 */
export const getUserFosterApplications = asyncHandler(async (req, res) => {
  const applications = await FosterApplication.find({ user: req.user._id })
    .populate('pet', 'name photos species breed')
    .populate('shelter', 'name')
    .sort('-createdAt');

  res.json(applications);
});

/**
 * @desc    Get foster applications for a shelter
 * @route   GET /api/fosters/shelter
 * @access  Private/Shelter
 */
export const getShelterFosterApplications = asyncHandler(async (req, res) => {
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
  const total = await FosterApplication.countDocuments(query);

  // Get applications
  const applications = await FosterApplication.find(query)
    .populate('pet', 'name photos species breed')
    .populate('user', 'name email phone')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

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
 * @desc    Get foster application by ID
 * @route   GET /api/fosters/:id
 * @access  Private
 */
export const getFosterApplicationById = asyncHandler(async (req, res) => {
  const application = await FosterApplication.findById(req.params.id)
    .populate('pet', 'name photos species breed age status')
    .populate('shelter', 'name email phone address')
    .populate('user', 'name email phone address');

  if (!application) {
    res.status(404);
    throw new Error('Foster application not found');
  }

  // Check if user is authorized to view this application
  const isUser = req.user._id.toString() === application.user._id.toString();
  const isShelter = req.user._id.toString() === application.shelter._id.toString();

  if (!isUser && !isShelter && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this foster application');
  }

  res.json(application);
});

/**
 * @desc    Update foster application status
 * @route   PUT /api/fosters/:id/status
 * @access  Private/Shelter
 */
export const updateFosterStatus = asyncHandler(async (req, res) => {
  const { status, feedback } = req.body;
  const application = await FosterApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Foster application not found');
  }

  // Check if shelter owns this application
  if (application.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this foster application');
  }

  // Update status
  application.status = status;

  // Add feedback if provided
  if (feedback) {
    application.feedback = {
      ...application.feedback,
      ...feedback,
      submittedAt: Date.now()
    };
  }

  // If approved, update pet's foster information
  if (status === 'Approved') {
    await Pet.findByIdAndUpdate(application.pet, {
      status: 'Fostered',
      'fosterInfo.currentFoster': application.user,
      $push: {
        'fosterInfo.fosterHistory': {
          foster: application.user,
          startDate: application.startDate,
          endDate: application.endDate,
          notes: application.notes
        }
      }
    });
  }

  // If completed, update pet's status back to available
  if (status === 'Completed') {
    await Pet.findByIdAndUpdate(application.pet, {
      status: 'Available',
      'fosterInfo.currentFoster': null
    });
  }

  await application.save();

  // Notify user
  const pet = await Pet.findById(application.pet);
  const user = await User.findById(application.user);

  await emailService.sendApplicationStatusUpdate({
    email: user.email,
    name: user.name,
    petName: pet.name,
    status: `Foster application ${status}`,
    message: feedback?.comments || ''
  });

  res.json({
    success: true,
    status: application.status,
    message: `Foster application marked as ${status}`
  });
});

/**
 * @desc    Schedule a home check
 * @route   POST /api/fosters/:id/homecheck
 * @access  Private/Shelter
 */
export const scheduleHomeCheck = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    res.status(400);
    throw new Error('Date is required');
  }

  const application = await FosterApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Foster application not found');
  }

  // Check if shelter owns this application
  if (application.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to schedule a home check for this application');
  }

  // Update home check
  application.homeCheckScheduled = {
    isScheduled: true,
    date: new Date(date)
  };

  await application.save();

  // Notify user
  const pet = await Pet.findById(application.pet);
  const user = await User.findById(application.user);

  await emailService.sendApplicationStatusUpdate({
    email: user.email,
    name: user.name,
    petName: pet.name,
    status: 'Home check scheduled',
    message: `Your home check has been scheduled for ${new Date(date).toLocaleString()}`
  });

  res.json({
    success: true,
    homeCheck: application.homeCheckScheduled
  });
});

/**
 * @desc    Complete home check
 * @route   PUT /api/fosters/:id/homecheck
 * @access  Private/Shelter
 */
export const completeHomeCheck = asyncHandler(async (req, res) => {
  const { passed, comments } = req.body;

  if (passed === undefined) {
    res.status(400);
    throw new Error('Please specify if the home check passed');
  }

  const application = await FosterApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Foster application not found');
  }

  // Check if shelter owns this application
  if (application.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to complete home check for this application');
  }

  // Update home check results
  application.homeCheckResults = {
    passed,
    comments,
    completedBy: req.user._id,
    completedAt: Date.now()
  };

  await application.save();

  res.json({
    success: true,
    homeCheckResults: application.homeCheckResults
  });
});

/**
 * @desc    Submit foster feedback
 * @route   POST /api/fosters/:id/feedback
 * @access  Private
 */
export const submitFosterFeedback = asyncHandler(async (req, res) => {
  const { rating, comments } = req.body;

  if (!rating) {
    res.status(400);
    throw new Error('Rating is required');
  }

  const application = await FosterApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Foster application not found');
  }

  // Check if user owns this application
  if (application.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to submit feedback for this application');
  }

  // Check if application is completed
  if (application.status !== 'Completed') {
    res.status(400);
    throw new Error('You can only submit feedback for completed foster periods');
  }

  // Add feedback
  application.feedback = {
    rating,
    comments,
    submittedAt: Date.now()
  };

  await application.save();

  res.json({
    success: true,
    feedback: application.feedback
  });
});