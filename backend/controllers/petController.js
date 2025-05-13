import asyncHandler from '../utils/asyncHandler.js';
import Pet from '../models/petModel.js';
import User from '../models/userModel.js';
import emailService from '../utils/emailService.js';

/**
 * @desc    Create a new pet listing
 * @route   POST /api/pets
 * @access  Private/Shelter
 */
export const createPet = asyncHandler(async (req, res) => {
  const petData = {
    ...req.body,
    shelter: req.user._id
  };

  const pet = await Pet.create(petData);

  // Notify users who have matching preferences
  notifyInterestedUsers(pet);

  res.status(201).json(pet);
});

/**
 * @desc    Get all pets with filtering
 * @route   GET /api/pets
 * @access  Public
 */
export const getPets = asyncHandler(async (req, res) => {
  // Build query based on request parameters
  const query = buildPetQuery(req.query);

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Execute query with pagination
  const total = await Pet.countDocuments(query);
  const pets = await Pet.find(query)
    .populate('shelter', 'name email phone address')
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort || '-createdAt');

  // Response with pagination info
  res.json({
    success: true,
    count: pets.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: pets
  });
});

/**
 * @desc    Get single pet by ID
 * @route   GET /api/pets/:id
 * @access  Public
 */
export const getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id)
    .populate('shelter', 'name email phone address bio')
    .populate({
      path: 'reviews',
      match: { isApproved: true },
      options: { sort: { createdAt: -1 } }
    });

  if (pet) {
    res.json(pet);
  } else {
    res.status(404);
    throw new Error('Pet not found');
  }
});

/**
 * @desc    Update pet listing
 * @route   PUT /api/pets/:id
 * @access  Private/Shelter
 */
export const updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }

  // Check if pet belongs to the shelter making the request
  if (pet.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this pet');
  }

  // Update pet data
  const updatedPet = await Pet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedPet);
});

/**
 * @desc    Delete pet listing
 * @route   DELETE /api/pets/:id
 * @access  Private/Shelter
 */
export const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }

  // Check if pet belongs to the shelter making the request
  if (pet.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this pet');
  }

  await pet.deleteOne();

  res.json({ message: 'Pet listing removed' });
});

/**
 * @desc    Get pets from shelter
 * @route   GET /api/pets/shelter/:shelterId
 * @access  Public
 */
export const getPetsByShelter = asyncHandler(async (req, res) => {
  const { shelterId } = req.params;
  
  // Check if shelter exists
  const shelterExists = await User.exists({ 
    _id: shelterId, 
    role: 'shelter'
  });
  
  if (!shelterExists) {
    res.status(404);
    throw new Error('Shelter not found');
  }
  
  // Build query
  const query = { 
    shelter: shelterId,
    ...buildPetQuery(req.query)
  };
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Execute query
  const total = await Pet.countDocuments(query);
  const pets = await Pet.find(query)
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort || '-createdAt');
  
  res.json({
    success: true,
    count: pets.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: pets
  });
});

/**
 * @desc    Update pet photos
 * @route   PUT /api/pets/:id/photos
 * @access  Private/Shelter
 */
export const updatePetPhotos = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }

  // Check if pet belongs to the shelter making the request
  if (pet.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this pet');
  }

  // Add new photos
  if (req.body.addPhotos && req.body.addPhotos.length > 0) {
    pet.photos = [...pet.photos, ...req.body.addPhotos];
  }

  // Remove photos
  if (req.body.removePhotoIds && req.body.removePhotoIds.length > 0) {
    pet.photos = pet.photos.filter(
      photo => !req.body.removePhotoIds.includes(photo._id.toString())
    );
  }

  // Update main photo
  if (req.body.mainPhotoId) {
    pet.photos = pet.photos.map(photo => ({
      ...photo,
      isMain: photo._id.toString() === req.body.mainPhotoId
    }));
  }

  await pet.save();

  res.json({
    success: true,
    data: pet.photos
  });
});

/**
 * @desc    Update pet status
 * @route   PUT /api/pets/:id/status
 * @access  Private/Shelter
 */
export const updatePetStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }

  // Check if pet belongs to the shelter making the request
  if (pet.shelter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this pet');
  }

  pet.status = status;
  await pet.save();

  res.json({
    success: true,
    status: pet.status
  });
});

/**
 * @desc    Search pets
 * @route   GET /api/pets/search
 * @access  Public
 */
export const searchPets = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Please provide a search term');
  }
  
  const pets = await Pet.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate('shelter', 'name')
    .limit(20);
  
  res.json({
    success: true,
    count: pets.length,
    data: pets
  });
});

// Helper function to build query based on filters
const buildPetQuery = (queryParams) => {
  const query = {};
  
  // Filter by status
  if (queryParams.status) {
    query.status = queryParams.status;
  } else {
    // Default to only available pets
    query.status = 'Available';
  }
  
  // Filter by species
  if (queryParams.species) {
    query.species = queryParams.species;
  }
  
  // Filter by breed
  if (queryParams.breed) {
    query.breed = { $regex: queryParams.breed, $options: 'i' };
  }
  
  // Filter by size
  if (queryParams.size) {
    query.size = queryParams.size;
  }
  
  // Filter by gender
  if (queryParams.gender) {
    query.gender = queryParams.gender;
  }
  
  // Filter by age
  if (queryParams.minAge || queryParams.maxAge) {
    query.age = {};
    if (queryParams.minAge) {
      query.age.value = { $gte: parseInt(queryParams.minAge) };
    }
    if (queryParams.maxAge) {
      query.age.value = { ...query.age.value, $lte: parseInt(queryParams.maxAge) };
    }
  }
  
  // Filter by location
  if (queryParams.city) {
    query['location.city'] = { $regex: queryParams.city, $options: 'i' };
  }
  if (queryParams.state) {
    query['location.state'] = { $regex: queryParams.state, $options: 'i' };
  }
  
  // Filter by good with children/dogs/cats
  if (queryParams.goodWithChildren) {
    query['behavior.goodWithChildren'] = queryParams.goodWithChildren === 'true';
  }
  if (queryParams.goodWithDogs) {
    query['behavior.goodWithDogs'] = queryParams.goodWithDogs === 'true';
  }
  if (queryParams.goodWithCats) {
    query['behavior.goodWithCats'] = queryParams.goodWithCats === 'true';
  }
  
  return query;
};

// Helper function to notify users with matching preferences
const notifyInterestedUsers = async (pet) => {
  try {
    // Find users with matching preferences who want to receive alerts
    const interestedUsers = await User.find({
      'preferences.receivePetAlerts': true,
      'preferences.species': pet.species,
      ...(pet.breed && { 'preferences.breeds': pet.breed }),
      ...(pet.age && {
        'preferences.ageRange.min': { $lte: pet.age.value },
        'preferences.ageRange.max': { $gte: pet.age.value }
      }),
      ...(pet.size && { 'preferences.size': pet.size })
    });
    
    // Send email to each interested user
    for (const user of interestedUsers) {
      await emailService.sendNewPetNotification({
        email: user.email,
        name: user.name,
        petName: pet.name,
        petBreed: pet.breed,
        petAge: `${pet.age.value} ${pet.age.unit}`
      });
    }
  } catch (error) {
    console.error('Error notifying users:', error);
    // Don't throw error to prevent blocking the main operation
  }
};