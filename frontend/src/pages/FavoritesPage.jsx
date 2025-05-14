import React, { useState, useEffect } from 'react';
import { fetchUserFavorites } from '../services/api';
import PetCard from '../components/pets/PetCard';
import Button from '../components/common/Button';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await fetchUserFavorites();
        setFavorites(data || []);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleFavoriteToggle = (petId, isFavorite) => {
    if (!isFavorite) {
      // If toggled to not favorite, remove from list
      setFavorites(prev => prev.filter(fav => fav.pet._id !== petId));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-lg text-gray-600">
            View and manage your favorite pets
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(favorite => (
              <PetCard 
                key={favorite.pet._id} 
                pet={favorite.pet} 
                isFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-pink-100 p-4">
                <Heart size={32} className="text-pink-500" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't added any pets to your favorites yet.
              Save pets you're interested in for easy access!
            </p>
            <Button to="/pets" variant="primary">
              Browse Pets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;