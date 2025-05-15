import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  User, 
  Clipboard, 
  MessageCircle, 
  Star, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { fetchPetById, addFavorite, removeFavorite, fetchReviews, submitReview } from '../services/api';
import Button from '../components/common/Button';
import ApplicationForm from '../components/applications/ApplicationForm';
import TextArea from '../components/common/TextArea';

const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [pet, setPet] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const loadPetDetails = async () => {
      try {
        setLoading(true);
        const petData = await fetchPetById(id);
        setPet(petData);
        // Check if pet is in user's favorites
        if (petData.isFavorite) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error loading pet details:', error);
        toast.error('Failed to load pet details');
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    };

    const loadReviews = async () => {
      try {
        const reviewsData = await fetchReviews(id, 'pet');
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    loadPetDetails();
    loadReviews();
  }, [id, navigate]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(id);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error('Error updating favorites');
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSubmitReview = async (e) => {
  e.preventDefault();

  if (!isAuthenticated) {
    toast.error('Please log in to submit a review');
    return;
  }

  if (!reviewText.trim() || !reviewTitle.trim()) {
    toast.error('Please complete all fields');
    return;
  }

  try {
    setSubmitLoading(true);

    const payload = {
      type: 'pet',
      pet: id,
      rating: reviewRating,
      title: reviewTitle,
      content: reviewText
    };

    console.log('Submitting review:', payload);

    await submitReview(payload);

    toast.success('Review submitted successfully!');
    setReviewText('');
    setReviewTitle('');
    setReviewRating(5);
    setShowReviewForm(false);

    const reviewsData = await fetchReviews(id, 'pet');
    setReviews(reviewsData);
  } catch (error) {
    toast.error('Failed to submit review');
    console.error('Error submitting review:', error.response?.data || error.message);
  } finally {
    setSubmitLoading(false);
  }
};


  const handleNextImage = () => {
    if (pet?.images?.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === pet.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (pet?.images?.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? pet.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Calculate age string
  const getAgeString = (birthdate) => {
    if (!birthdate) return 'Age unknown';
    
    const today = new Date();
    const birth = new Date(birthdate);
    const monthDiff = today.getMonth() - birth.getMonth() + 
                     (12 * (today.getFullYear() - birth.getFullYear()));
    
    if (monthDiff < 12) {
      return `${monthDiff} month${monthDiff !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(monthDiff / 12);
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>
            <div className="bg-gray-100 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pet Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the pet you're looking for. It may have been adopted or removed.
        </p>
        <Button to="/pets" variant="primary">
          Browse Other Pets
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Search Results
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            {pet.name}
            {pet.adoptionStatus === 'available' && (
              <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Available
              </span>
            )}
            {pet.adoptionStatus === 'pending' && (
              <span className="ml-3 bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Pending
              </span>
            )}
            {pet.adoptionStatus === 'adopted' && (
              <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Adopted
              </span>
            )}
          </h1>
          <div className="flex items-center mt-2 text-gray-600">
            <span className="flex items-center mr-4">
              <MapPin size={16} className="mr-1" />
              {pet.location
    ? `${pet.location.city}, ${pet.location.state}, ${pet.location.country}`
    : 'Location not available'}
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {getAgeString(pet.birthdate)}
            </span>
            <span className="ml-auto flex items-center">
              <button 
                onClick={handleFavoriteToggle}
                className="flex items-center text-gray-600 hover:text-purple-600"
              >
                <Heart size={20} className={isFavorite ? "fill-purple-600 text-purple-600" : ""} />
                <span className="ml-2">{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              <button className="ml-4 text-gray-600 hover:text-purple-600">
                <Share2 size={20} />
              </button>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Pet Images */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative">
                <img 
                  src={pet.images && pet.images.length > 0 ? pet.images[activeImageIndex] : 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'} 
                  alt={pet.name} 
                  className="w-full h-[500px] object-cover"
                />
                
                {pet.images && pet.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              
              {pet.images && pet.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {pet.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`
                        h-16 w-16 rounded-md overflow-hidden flex-shrink-0
                        ${activeImageIndex === index ? 'ring-2 ring-purple-500' : ''}
                      `}
                    >
                      <img 
                        src={img} 
                        alt={`${pet.name} thumbnail ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pet Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About {pet.name}</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {pet.description || 'No description available for this pet.'}
              </p>
              
              {/* Pet Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Breed</p>
                  <p className="font-medium">{pet.breed || 'Unknown'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{getAgeString(pet.birthdate)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{pet.gender === 'male' ? 'Male' : 'Female'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{pet.size || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{pet.color || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Adoption Fee</p>
                  <p className="font-medium">{`$${pet.adoptionFee || 'Varies'}`}</p>
                </div>
              </div>
              
              {/* Good With */}
              {pet.goodWith && pet.goodWith.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Good with</h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.goodWith.map((trait, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Health & Behavior */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Health & Behavior</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${pet.vaccinated ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <span className={`text-xs ${pet.vaccinated ? 'text-green-800' : 'text-gray-800'}`}>✓</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 font-medium">Vaccinated</p>
                      <p className="text-sm text-gray-500">
                        {pet.vaccinated ? 'Up to date on vaccinations' : 'Vaccination status unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${pet.spayedNeutered ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <span className={`text-xs ${pet.spayedNeutered ? 'text-green-800' : 'text-gray-800'}`}>✓</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 font-medium">Spayed/Neutered</p>
                      <p className="text-sm text-gray-500">
                        {pet.spayedNeutered ? 'Yes' : 'No or unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${pet.microchipped ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <span className={`text-xs ${pet.microchipped ? 'text-green-800' : 'text-gray-800'}`}>✓</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 font-medium">Microchipped</p>
                      <p className="text-sm text-gray-500">
                        {pet.microchipped ? 'Yes' : 'No or unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
                {isAuthenticated && !showReviewForm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write a Review
                  </Button>
                )}
              </div>
              
              {showReviewForm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <form onSubmit={handleSubmitReview}>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Write a Review</h3>

                    <div className="mb-4">
          <label
            htmlFor="reviewTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="reviewTitle"
            name="reviewTitle"
            placeholder="Enter a short title for your review"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="text-2xl focus:outline-none"
                          >
                            <Star 
                              className={`${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              size={24}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <TextArea
                      label="Review"
                      id="reviewText"
                      name="reviewText"
                      placeholder="Share your experience with this pet..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="text" 
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={submitLoading}
                      >
                        {submitLoading ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium">{review.title}</p>
                      <p className="text-gray-700 mt-2">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No reviews yet. Be the first to share your experience with {pet.name}!
                </p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2">
            {/* Shelter Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Adoption Info</h2>
              
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <User size={24} className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{pet.shelter?.name || 'Pet Shelter'}</p>
                  <p className="text-sm text-gray-500">
                    {pet.shelter?.location
    ? [
        pet.shelter.location.city,
        pet.shelter.location.state,
        pet.shelter.location.country,
      ]
        .filter(Boolean)
        .join(', ')
    : pet.location
    ? [
        pet.location.city,
        pet.location.state,
        pet.location.country,
      ]
        .filter(Boolean)
        .join(', ')
    : 'Location not available'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <Button 
                  variant="primary" 
                  fullWidth 
                  disabled={pet.adoptionStatus !== 'available'}
                  onClick={() => setShowApplicationForm(true)}
                >
                  <Clipboard size={18} className="mr-2" />
                  Start Adoption Process
                </Button>
                
                <Button variant="outline" fullWidth>
                  <MessageCircle size={18} className="mr-2" />
                  Contact Shelter
                </Button>
              </div>
              
              <div className="bg-purple-50 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <Info size={18} className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      This pet is currently located at {pet.shelter?.name || 'the shelter'} in{' '}
  {pet.location
    ? [pet.location.city, pet.location.state, pet.location.country]
        .filter(Boolean)
        .join(', ')
    : 'an unknown location'}
  . Contact the shelter to schedule a visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Adoption Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Adoption Process</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Submit Application</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Fill out the adoption application form with your information and living situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Application Review</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      The shelter will review your application and may contact you for additional information.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Meet & Greet</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Schedule a time to meet {pet.name} in person at the shelter.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Finalize Adoption</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Complete the adoption paperwork and pay any applicable fees.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                      5
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Welcome Home!</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Take {pet.name} to their new forever home and begin your journey together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Adoption Application</h2>
              <button 
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <ApplicationForm 
                petId={pet._id} 
                petName={pet.name}
                onSuccess={() => setShowApplicationForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetailsPage;