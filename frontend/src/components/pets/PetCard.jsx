import React from "react";
import { Heart, HeartOff } from "lucide-react";
import { Link } from "react-router-dom";

const PetCard = ({ pet, isFavorite, onFavoriteToggle }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevents the click from triggering the Link
    e.preventDefault(); // Prevents navigation
    onFavoriteToggle(pet._id, !isFavorite);
  };

  return (
    <Link
      to={`/pets/${pet._id}`}
      className="relative group rounded-lg shadow-lg overflow-hidden bg-white block"
    >
      <img
        src={
          pet.photos?.find((photo) => photo.isMain)?.url ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={`${pet.name} the ${pet.species}`}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
        <p className="text-sm text-gray-600 mb-2 capitalize">
          {pet.type} • {pet.breed} • {pet.age?.value} {pet.age?.unit}
        </p>
        <p className="text-sm text-gray-700">{pet.description}</p>
      </div>
      <button
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors z-10"
      >
        {isFavorite ? <Heart size={24} /> : <HeartOff size={24} />}
      </button>
    </Link>
  );
};

export default PetCard;
