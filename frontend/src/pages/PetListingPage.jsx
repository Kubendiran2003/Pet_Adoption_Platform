import React, { useState, useEffect } from 'react';
import { fetchPets } from '../services/api';
import PetFilters from '../components/pets/PetFilters';
import PetCard from '../components/pets/PetCard';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const PetListingPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalPets: 0
  });
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadPets();
  }, [filters, pagination.page, pagination.limit]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await fetchPets(params);
      setPets(response.pets || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalPets: response.totalPets || 0
      }));
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteToggle = (petId, isFavorite) => {
    if (isFavorite) {
      setFavorites(prev => [...prev, petId]);
    } else {
      setFavorites(prev => prev.filter(id => id !== petId));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Pets</h1>
          <p className="text-lg text-gray-600">
            Find your new best friend among our {pagination.totalPets} available pets
          </p>
        </div>

        <PetFilters 
          onApplyFilters={handleApplyFilters} 
          initialFilters={filters}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : (
          <>
            {pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pets.map(pet => (
                  <PetCard 
                    key={pet._id} 
                    pet={pet} 
                    isFavorite={favorites.includes(pet._id)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="No pets found" 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">No pets found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any pets matching your search criteria. Try adjusting your filters or check back later.
                </p>
                <Button 
                  onClick={() => handleApplyFilters({})} 
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  
                  {[...Array(pagination.totalPages).keys()].map(page => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-3 py-1 rounded ${
                        pagination.page === page + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PetListingPage;