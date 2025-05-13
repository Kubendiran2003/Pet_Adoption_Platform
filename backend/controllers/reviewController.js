import asyncHandler from '../utils/asyncHandler.js';
import Review from '../models/reviewModel.js';
import Pet from '../models/petModel.js';
import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';

/**
 * @desc    Create a new review for shelter or pet
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { type, shelter, pet, rating, title, content } = req.body;

  // Validate input
  if (!type || !rating || !title || !content) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (type === 'shelter' && !shelter) {
    res.status(400);
    throw new Error('Shelter ID is required for shelter reviews');
  }

  if (type === 'pet' && !pet) {
    res.status(400);
    throw new Error('Pet ID is required for pet reviews');
  }

  // Check if entity exists
  if (type === 'shelter') {
    const shelterExists = await User.findOne({ _id: shelter, role: 'shelter' });
    if (!shelterExists) {
      res.status(404);
      throw new Error('Shelter not found');
    }
  } else {
    const petExists = await Pet.findById(pet);
    if (!petExists) {
      res.status(404);
      throw new Error('Pet not found');
    }
  }

  // Check if user already reviewed this entity
  const existingReview = await Review.findOne({
    user: req.user._id,
    ...(type === 'shelter' ? { shelter } : { pet }),
    type
  });

  if (existingReview) {
    res.status(400);
    throw new Error(`You have already reviewed this ${type}`);
  }

  // Check if user is a verified adopter
  let isVerifiedAdopter = false;
  if (type === 'shelter') {
    const adoptionApplication = await Application.findOne({
      user: req.user._id,
      shelter,
      status: 'Approved'
    });
    isVerifiedAdopter = !!adoptionApplication;
  } else {
    const adoptionApplication = await Application.findOne({
      user: req.user._id,
      pet,
      status: 'Approved'
    });
    isVerifiedAdopter = !!adoptionApplication;
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    ...(type === 'shelter' ? { shelter } : { pet }),
    type,
    rating,
    title,
    content,
    isVerifiedAdopter
  });

  res.status(201).json(review);
});

/**
 * @desc    Get reviews for a shelter
 * @route   GET /api/reviews/shelter/:shelterId
 * @access  Public
 */
export const getShelterReviews = asyncHandler(async (req, res) => {
  const { shelterId } = req.params;

  // Check if shelter exists
  const shelterExists = await User.findOne({ _id: shelterId, role: 'shelter' });
  if (!shelterExists) {
    res.status(404);
    throw new Error('Shelter not found');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Get reviews
  const total = await Review.countDocuments({
    shelter: shelterId,
    type: 'shelter',
    isApproved: true
  });

  const reviews = await Review.find({
    shelter: shelterId,
    type: 'shelter',
    isApproved: true
  })
    .populate('user', 'name')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

  // Get average rating
  const ratingStats = await Review.getAverageRating(shelterId, 'shelter');

  res.json({
    success: true,
    count: reviews.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    rating: ratingStats.averageRating,
    numReviews: ratingStats.numReviews,
    data: reviews
  });
});

/**
 * @desc    Get reviews for a pet
 * @route   GET /api/reviews/pet/:petId
 * @access  Public
 */
export const getPetReviews = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  // Check if pet exists
  const petExists = await Pet.findById(petId);
  if (!petExists) {
    res.status(404);
    throw new Error('Pet not found');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Get reviews
  const total = await Review.countDocuments({
    pet: petId,
    type: 'pet',
    isApproved: true
  });

  const reviews = await Review.find({
    pet: petId,
    type: 'pet',
    isApproved: true
  })
    .populate('user', 'name')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

  // Get average rating
  const ratingStats = await Review.getAverageRating(petId, 'pet');

  res.json({
    success: true,
    count: reviews.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    rating: ratingStats.averageRating,
    numReviews: ratingStats.numReviews,
    data: reviews
  });
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, title, content } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  // Update review
  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.content = content || review.content;
  review.isApproved = true; // Reset to true when updated

  await review.save();

  res.json(review);
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or is admin
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();

  res.json({ message: 'Review removed' });
});

/**
 * @desc    Add response to a review
 * @route   POST /api/reviews/:id/response
 * @access  Private/Shelter
 */
export const addReviewResponse = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if shelter owns this review
  if (
    (review.type === 'shelter' &&
      review.shelter.toString() !== req.user._id.toString()) ||
    (review.type === 'pet' &&
      !(await Pet.exists({
        _id: review.pet,
        shelter: req.user._id
      })))
  ) {
    res.status(403);
    throw new Error('Not authorized to respond to this review');
  }

  // Add response
  review.response = {
    content,
    respondedBy: req.user._id,
    respondedAt: Date.now()
  };

  await review.save();

  res.json(review);
});

/**
 * @desc    Mark review as helpful
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
export const markReviewHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user already marked this review as helpful
  const alreadyMarked = review.helpfulVotes.users.includes(req.user._id);

  if (alreadyMarked) {
    // Remove helpful vote
    review.helpfulVotes.users = review.helpfulVotes.users.filter(
      id => id.toString() !== req.user._id.toString()
    );
    review.helpfulVotes.count -= 1;
  } else {
    // Add helpful vote
    review.helpfulVotes.users.push(req.user._id);
    review.helpfulVotes.count += 1;
  }

  await review.save();

  res.json({
    success: true,
    helpfulCount: review.helpfulVotes.count,
    message: alreadyMarked
      ? 'Removed helpful vote'
      : 'Marked review as helpful'
  });
});

/**
 * @desc    Approve or disapprove a review (admin only)
 * @route   PUT /api/reviews/:id/approve
 * @access  Private/Admin
 */
export const approveReview = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Update approval status
  review.isApproved = isApproved;
  await review.save();

  res.json({
    success: true,
    message: isApproved ? 'Review approved' : 'Review disapproved'
  });
});