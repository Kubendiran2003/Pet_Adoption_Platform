import React, { useState, useEffect } from "react";
import {
  fetchPets,
  fetchUserFavorites,
  toggleSavedPet,
  searchPets,
} from "../services/api";
import { toast } from "react-hot-toast";
import PetFilters from "../components/pets/PetFilters";
import PetCard from "../components/pets/PetCard";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const PetListingPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalPets: 0,
  });
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadPets();
  }, [filters, pagination.page]);

  const loadPets = async () => {
    setLoading(true);
    try {
      let response;

      if (filters.q) {
        response = await searchPets(filters.q);
      } else {
        const params = {
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        };
        response = await fetchPets(params);
      }

      const transformedPets = response.data.map((pet) => ({
        ...pet,
        photoUrl:
          pet.photos?.find((p) => p.isMain)?.url ||
          "https://via.placeholder.com/300x200?text=No+Image",
        age: pet.age?.value || 0,
        ageUnit: pet.age?.unit || "years",
        goodWithChildren: pet.behavior?.goodWithChildren || false,
        goodWithDogs: pet.behavior?.goodWithDogs || false,
        goodWithCats: pet.behavior?.goodWithCats || false,
        isFavorite: favorites.includes(pet._id.toString()),
      }));

      setPets(transformedPets);

      if (!filters.q) {
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 12,
          totalPages: response.pagination?.pages || 1,
          totalPets: response.count || 0,
        });
      } else {
        setPagination((prev) => ({
          ...prev,
          page: 1,
          totalPets: response.count || 0,
        }));
      }

      if (isAuthenticated) {
        const favs = await fetchUserFavorites();
        setFavorites(favs.map((pet) => pet._id.toString()));
      }
    } catch (error) {
      console.error("Failed to load pets:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load pets. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavoriteToggle = async (petId) => {
    if (!isAuthenticated) {
      toast.error("Please login to save pets to favorites");
      return;
    }

    try {
      const data = await toggleSavedPet(petId);
      setFavorites(data.savedPets.map((id) => id.toString()));

      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet._id === petId ? { ...pet, isFavorite: !pet.isFavorite } : pet
        )
      );

      toast.success(
        data.savedPets.includes(petId)
          ? "Added to favorites"
          : "Removed from favorites"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Pets
          </h1>
          <p className="text-lg text-gray-600">
            Find your new best friend among our {pagination.totalPets} available
            pets
          </p>
        </div>

        <PetFilters
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
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
        ) : pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet._id}
                  pet={pet}
                  isFavorite={favorites.includes(pet._id.toString())}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

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

                  {[...Array(pagination.totalPages).keys()].map((index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          pagination.page === page
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

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
              We couldn't find any pets matching your search criteria. Try
              adjusting your filters or check back later.
            </p>
            <Button onClick={() => handleApplyFilters({})}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListingPage;
