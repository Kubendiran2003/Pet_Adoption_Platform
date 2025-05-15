import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PawPrint, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  MessageCircle
} from 'lucide-react';
import { fetchShelterPets, fetchShelterApplications } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { ConfirmModal } from '../components/common/Modal';

const ShelterDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('pets');
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pets') {
        const petsData = await fetchShelterPets();
        setPets(petsData || []);
      } else {
        const applicationsData = await fetchShelterApplications();
        setApplications(applicationsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = (petId) => {
    setSelectedPetId(petId);
    setShowDeleteModal(true);
  };

  const confirmDeletePet = async () => {
    try {
      // await deletePet(selectedPetId);
      setPets(pets.filter(pet => pet._id !== selectedPetId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus ? pet.adoptionStatus === filterStatus : true)
  );

  const filteredApplications = applications.filter(app =>
    app.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus ? app.status === filterStatus : true)
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shelter Dashboard</h1>
              <p className="text-gray-600">Manage your pets and adoption applications</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                to="/pets/new"
                variant="primary"
                icon={<Plus size={18} />}
              >
                Add New Pet
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3">
                  <PawPrint className="text-purple-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Pets</p>
                  <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="text-green-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Adopted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pets.filter(pet => pet.adoptionStatus === 'adopted').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-full p-3">
                  <Clock className="text-yellow-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pets')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'pets'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pets
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'applications'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={`Search ${activeTab === 'pets' ? 'pets' : 'applications'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} className="text-gray-400" />}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={
                    activeTab === 'pets'
                      ? [
                          { value: '', label: 'All Statuses' },
                          { value: 'available', label: 'Available' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'adopted', label: 'Adopted' }
                        ]
                      : [
                          { value: '', label: 'All Statuses' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'approved', label: 'Approved' },
                          { value: 'rejected', label: 'Rejected' }
                        ]
                  }
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'pets' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applications
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listed Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPets.map((pet) => (
                      <tr key={pet._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={pet.images?.[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                              alt={pet.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                              <div className="text-sm text-gray-500">{pet.breed}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pet.adoptionStatus === 'available'
                              ? 'bg-green-100 text-green-800'
                              : pet.adoptionStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {pet.adoptionStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pet.applicationCount || 0} applications
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(pet.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Edit size={16} />}
                              to={`/pets/${pet._id}/edit`}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              icon={<Trash size={16} />}
                              onClick={() => handleDeletePet(pet._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application._id} className="bg-white border rounded-lg shadow-sm">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={application.pet?.images?.[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                            alt={application.pet?.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Application for {application.pet?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              From {application.user?.name} • {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          application.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Housing</p>
                          <p className="font-medium">{application.housing}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{application.experience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Other Pets</p>
                          <p className="font-medium">{application.hasOtherPets ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Reason for Adopting</p>
                        <p className="text-gray-700">{application.reasonForAdopting}</p>
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<MessageCircle size={16} />}
                        >
                          Message
                        </Button>
                        {application.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              icon={<CheckCircle size={16} />}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<XCircle size={16} />}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePet}
        title="Delete Pet"
        message="Are you sure you want to delete this pet? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ShelterDashboardPage;