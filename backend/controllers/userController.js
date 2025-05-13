import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address, bio } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user', // Default to user role
    phone,
    address,
    bio
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      preferences: user.preferences,
      savedPets: user.savedPets,
      createdAt: user.createdAt
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.bio = req.body.bio || user.bio;
    user.preferences = req.body.preferences || user.preferences;

    // Only change password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      bio: updatedUser.bio,
      preferences: updatedUser.preferences,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get all shelters
 * @route   GET /api/users/shelters
 * @access  Public
 */
export const getShelters = asyncHandler(async (req, res) => {
  const shelters = await User.find({ role: 'shelter' }).select('-preferences -savedPets');
  
  res.json(shelters);
});

/**
 * @desc    Get shelter by ID
 * @route   GET /api/users/shelters/:id
 * @access  Public
 */
export const getShelterById = asyncHandler(async (req, res) => {
  const shelter = await User.findOne({ 
    _id: req.params.id,
    role: 'shelter'
  }).select('-preferences -savedPets');

  if (shelter) {
    res.json(shelter);
  } else {
    res.status(404);
    throw new Error('Shelter not found');
  }
});

/**
 * @desc    Add/remove pet from saved pets
 * @route   POST /api/users/savedPets
 * @access  Private
 */
export const toggleSavedPet = asyncHandler(async (req, res) => {
  const { petId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const alreadySaved = user.savedPets.includes(petId);

  if (alreadySaved) {
    // Remove pet from saved list
    user.savedPets = user.savedPets.filter(id => id.toString() !== petId);
  } else {
    // Add pet to saved list
    user.savedPets.push(petId);
  }

  await user.save();

  res.json({
    savedPets: user.savedPets,
    message: alreadySaved ? 'Pet removed from saved list' : 'Pet added to saved list'
  });
});

/**
 * @desc    Get user's saved pets
 * @route   GET /api/users/savedPets
 * @access  Private
 */
export const getSavedPets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedPets');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.savedPets);
});

/**
 * @desc    Update user preferences for pet alerts
 * @route   PUT /api/users/preferences
 * @access  Private
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.preferences = {
    ...user.preferences,
    ...req.body
  };

  await user.save();

  res.json({
    preferences: user.preferences,
    message: 'Preferences updated successfully'
  });
});