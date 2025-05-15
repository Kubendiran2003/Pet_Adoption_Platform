import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { fetchUserApplications } from '../services/api';
import Button from '../components/common/Button';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchUserApplications();
        setApplications(data || []);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const toggleApplicationDetails = (id) => {
    setExpandedApplicationId(expandedApplicationId === id ? null : id);
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      case 'pending':
      default:
        return <Clock size={20} className="text-yellow-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-lg text-gray-600">
            Track and manage your pet adoption applications
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-1 ${
                activeTab === 'all'
                  ? 'border-b-2 border-purple-500 text-purple-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-4 px-1 ${
                activeTab === 'pending'
                  ? 'border-b-2 border-purple-500 text-purple-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`pb-4 px-1 ${
                activeTab === 'approved'
                  ? 'border-b-2 border-purple-500 text-purple-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`pb-4 px-1 ${
                activeTab === 'rejected'
                  ? 'border-b-2 border-purple-500 text-purple-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleApplicationDetails(application._id)}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={application.pet?.images?.[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                        alt={application.pet?.name}
                        className="h-12 w-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Application for {application.pet?.name || 'Pet'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Submitted on {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </span>
                      <ChevronDown
                        size={20}
                        className={`ml-2 text-gray-500 transition-transform ${
                          expandedApplicationId === application._id ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedApplicationId === application._id && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Pet Information</h4>
                        <div className="bg-white p-4 rounded-md">
                          <div className="flex items-center mb-4">
                            <img
                              src={application.pet?.images?.[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                              alt={application.pet?.name}
                              className="h-16 w-16 rounded-md object-cover mr-4"
                            />
                            <div>
                              <h5 className="font-medium">
                                {application.pet?.name || 'Pet'}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {application.pet?.breed || 'Unknown breed'}, {application.pet?.age ? `${application.pet.age.value} ${application.pet.age.unit}` : 'Unknown age'}
                              </p>
                              <Link 
                                to={`/pets/${application.pet?._id}`} 
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                              >
                                View Pet Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Application Details</h4>
                        <div className="bg-white p-4 rounded-md space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Housing</p>
                            <p className="font-medium capitalize">{application.housing || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Has Children</p>
                            <p className="font-medium">{application.hasChildren === 'yes' ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Has Other Pets</p>
                            <p className="font-medium">{application.hasOtherPets === 'yes' ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Work Schedule</p>
                            <p className="font-medium capitalize">{application.workSchedule || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {application.status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mt-6">
                        <div className="flex">
                          <Clock size={20} className="text-yellow-600 flex-shrink-0" />
                          <div className="ml-3">
                            <h5 className="text-yellow-800 font-medium">Application Under Review</h5>
                            <p className="text-yellow-700 text-sm">
                              Your application is being reviewed by the shelter. You should receive a response within 2-3 business days.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {application.status === 'approved' && (
                      <div className="bg-green-50 border border-green-100 rounded-md p-4 mt-6">
                        <div className="flex">
                          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                          <div className="ml-3">
                            <h5 className="text-green-800 font-medium">Application Approved!</h5>
                            <p className="text-green-700 text-sm">
                              Congratulations! The shelter has approved your application. They will contact you soon to schedule a meet and greet.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {application.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-100 rounded-md p-4 mt-6">
                        <div className="flex">
                          <XCircle size={20} className="text-red-600 flex-shrink-0" />
                          <div className="ml-3">
                            <h5 className="text-red-800 font-medium">Application Not Approved</h5>
                            <p className="text-red-700 text-sm">
                              We're sorry, your application was not approved at this time. Please contact the shelter for more information.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between">
                      <Button
                        to={`/pets/${application.pet?._id}`}
                        variant="outline"
                      >
                        View Pet
                      </Button>
                      <Button
                        variant="primary"
                        icon={<MessageCircle size={18} />}
                      >
                        Contact Shelter
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-purple-100 p-4">
                <ClipboardIcon size={32} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              You haven't submitted any adoption applications yet.
              Start by finding a pet you'd like to adopt!
            </p>
            <Button to="/pets" variant="primary">
              Find Pets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ClipboardIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

export default ApplicationsPage;