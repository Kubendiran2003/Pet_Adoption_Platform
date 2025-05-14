import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addFavorite, removeFavorite } from '../../services/api';
import { toast } from 'react-hot-toast';

const PetCard = ({ pet, isFavorite, onFavoriteToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      
      if (favoriteStatus) {
        await removeFavorite(pet._id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(pet._id);
        toast.success('Added to favorites');
      }
      
      setFavoriteStatus(!favoriteStatus);
      if (onFavoriteToggle) {
        onFavoriteToggle(pet._id, !favoriteStatus);
      }
    } catch (error) {
      toast.error('Error updating favorites');
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate age string
  const getAgeString = (birthdate) => {
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

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/pets/${pet._id}`} className="block h-full">
        <div className="relative">
          <img 
            src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'} 
            alt={pet.name} 
            className="w-full h-48 object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <button 
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full ${favoriteStatus ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'} opacity-90 hover:opacity-100 transition-colors duration-200`}
            aria-label={favoriteStatus ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={18} className={favoriteStatus ? 'fill-white' : ''} />
          </button>
          {pet.adoptionStatus === 'available' && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
              Available
            </div>
          )}
          {pet.adoptionStatus === 'pending' && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
              Pending
            </div>
          )}
          {pet.adoptionStatus === 'adopted' && (
            <div className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
              Adopted
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
            <span className={`text-sm font-medium ${pet.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`}>
              {pet.gender === 'male' ? '♂' : '♀'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{pet.breed}</p>
          
          <div className="mt-2 space-y-2 flex-grow">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{pet.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>{pet.birthdate ? getAgeString(pet.birthdate) : 'Age unknown'}</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {pet.goodWith && pet.goodWith.map((trait, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium text-purple-600">
              <Info size={16} className="mr-1" />
              View Details
            </div>
            {pet.adoptionFee ? (
              <span className="font-semibold text-gray-700">${pet.adoptionFee}</span>
            ) : (
              <span className="font-semibold text-gray-700">Fee varies</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PetCard;