import React, { useState, useEffect } from "react";

const PetFilters = ({ onApplyFilters, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    species: initialFilters.species || "",
    breed: initialFilters.breed || "",
    age: initialFilters.age || "",
    gender: initialFilters.gender || "",
    size: initialFilters.size || "",
    goodWithChildren: initialFilters.goodWithChildren || false,
    goodWithDogs: initialFilters.goodWithDogs || false,
    goodWithCats: initialFilters.goodWithCats || false,
    status: initialFilters.status || "Available", // Default to available pets
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build query object that matches your API's expected format
    const query = {
      ...(filters.search && { q: filters.search }),
      ...(filters.species && { species: filters.species }),
      ...(filters.breed && { breed: filters.breed }),
      ...(filters.age && { age: filters.age }),
      ...(filters.gender && { gender: filters.gender }),
      ...(filters.size && { size: filters.size }),
      ...(filters.goodWithChildren && { goodWithChildren: true }),
      ...(filters.goodWithDogs && { goodWithDogs: true }),
      ...(filters.goodWithCats && { goodWithCats: true }),
      status: filters.status,
    };

    onApplyFilters(query);
  };

  const handleClear = () => {
    setFilters({
      search: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      size: "",
      goodWithChildren: false,
      goodWithDogs: false,
      goodWithCats: false,
      status: "Available",
    });
    onApplyFilters({});
  };

  // Sync with external filter changes
  useEffect(() => {
    setFilters({
      search: initialFilters.search || "",
      species: initialFilters.species || "",
      breed: initialFilters.breed || "",
      age: initialFilters.age || "",
      gender: initialFilters.gender || "",
      size: initialFilters.size || "",
      goodWithChildren: initialFilters.goodWithChildren || false,
      goodWithDogs: initialFilters.goodWithDogs || false,
      goodWithCats: initialFilters.goodWithCats || false,
      status: initialFilters.status || "Available",
    });
  }, [initialFilters]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search pets..."
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Species Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species
          </label>
          <select
            name="species"
            value={filters.species}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
          </select>
        </div>

        {/* Breed Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Breed
          </label>
          <input
            type="text"
            name="breed"
            value={filters.breed}
            onChange={handleChange}
            placeholder="Enter breed"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Age Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <select
            name="age"
            value={filters.age}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Any Age</option>
            <option value="baby">Baby</option>
            <option value="young">Young</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        {/* Gender Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Any Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Size Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            name="size"
            value={filters.size}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Any Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>

        {/* Good With Checkboxes */}
        <div className="md:col-span-2 lg:col-span-3">
          <fieldset className="border border-gray-300 rounded-md p-3">
            <legend className="px-2 text-sm font-medium text-gray-700">
              Good With
            </legend>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="goodWithChildren"
                  checked={filters.goodWithChildren}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2">Children</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="goodWithDogs"
                  checked={filters.goodWithDogs}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2">Dogs</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="goodWithCats"
                  checked={filters.goodWithCats}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2">Cats</span>
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default PetFilters;
