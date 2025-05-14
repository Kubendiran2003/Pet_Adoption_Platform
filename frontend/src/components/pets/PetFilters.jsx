import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const PetFilters = ({ onApplyFilters, initialFilters = {} }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    type: initialFilters.type || '',
    breed: initialFilters.breed || '',
    age: initialFilters.age || '',
    gender: initialFilters.gender || '',
    size: initialFilters.size || '',
    goodWith: initialFilters.goodWith || [],
    adoptionStatus: initialFilters.adoptionStatus || '',
    ...initialFilters
  });
  
  const petTypes = [
    { value: 'dog', label: 'Dogs' },
    { value: 'cat', label: 'Cats' },
    { value: 'bird', label: 'Birds' },
    { value: 'rabbit', label: 'Rabbits' },
    { value: 'small_animal', label: 'Small Animals' },
    { value: 'reptile', label: 'Reptiles' },
    { value: 'other', label: 'Other' }
  ];
  
  const ageOptions = [
    { value: 'baby', label: 'Baby' },
    { value: 'young', label: 'Young' },
    { value: 'adult', label: 'Adult' },
    { value: 'senior', label: 'Senior' }
  ];
  
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];
  
  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ];
  
  const goodWithOptions = [
    { value: 'kids', label: 'Kids' },
    { value: 'dogs', label: 'Dogs' },
    { value: 'cats', label: 'Cats' },
    { value: 'other_animals', label: 'Other Animals' }
  ];
  
  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'adopted', label: 'Adopted' }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGoodWithChange = (value) => {
    if (filters.goodWith.includes(value)) {
      setFilters(prev => ({
        ...prev,
        goodWith: prev.goodWith.filter(item => item !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        goodWith: [...prev.goodWith, value]
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };
  
  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      goodWith: [],
      adoptionStatus: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    setIsAdvancedOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="text"
              name="search"
              id="search"
              placeholder="Search by name, breed, or location"
              value={filters.search}
              onChange={handleInputChange}
              icon={<Search size={18} className="text-gray-400" />}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              name="type"
              id="type"
              value={filters.type}
              onChange={handleInputChange}
              options={petTypes}
              placeholder="Any animal"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              name="adoptionStatus"
              id="adoptionStatus"
              value={filters.adoptionStatus}
              onChange={handleInputChange}
              options={statusOptions}
              placeholder="Any status"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              icon={isAdvancedOpen ? <X size={18} /> : <Filter size={18} />}
            >
              {isAdvancedOpen ? 'Hide' : 'Filters'}
            </Button>
          </div>
        </div>
        
        {isAdvancedOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Breed"
                name="breed"
                id="breed"
                value={filters.breed}
                onChange={handleInputChange}
                options={[]}
                placeholder="Any breed"
              />
              
              <Select
                label="Age"
                name="age"
                id="age"
                value={filters.age}
                onChange={handleInputChange}
                options={ageOptions}
                placeholder="Any age"
              />
              
              <Select
                label="Gender"
                name="gender"
                id="gender"
                value={filters.gender}
                onChange={handleInputChange}
                options={genderOptions}
                placeholder="Any gender"
              />
              
              <Select
                label="Size"
                name="size"
                id="size"
                value={filters.size}
                onChange={handleInputChange}
                options={sizeOptions}
                placeholder="Any size"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Good with
              </label>
              <div className="flex flex-wrap gap-2">
                {goodWithOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleGoodWithChange(option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.goodWith.includes(option.value)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="text"
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PetFilters;