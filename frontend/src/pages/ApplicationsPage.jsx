// src/pages/ApplicationsPage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import {
  fetchUserApplications,
  getUserFosterApplications,
} from "../services/api";
import Button from "../components/common/Button";

const ApplicationsPage = () => {
  const [adoptionApplications, setAdoptionApplications] = useState([]);
  const [fosterApplications, setFosterApplications] = useState([]);
  const [loadingAdoption, setLoadingAdoption] = useState(true);
  const [loadingFoster, setLoadingFoster] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState("adoption"); // "adoption" or "foster"
  const [activeStatusTab, setActiveStatusTab] = useState("all"); // "all", "pending", "approved", "rejected"
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

  useEffect(() => {
    const loadAdoptionApplications = async () => {
      try {
        setLoadingAdoption(true);
        const data = await fetchUserApplications();
        setAdoptionApplications(data || []);
      } catch (error) {
        console.error("Error loading adoption applications:", error);
      } finally {
        setLoadingAdoption(false);
      }
    };

    const loadFosterApplications = async () => {
      try {
        setLoadingFoster(true);
        const data = await getUserFosterApplications();
        setFosterApplications(data || []);
      } catch (error) {
        console.error("Error loading foster applications:", error);
      } finally {
        setLoadingFoster(false);
      }
    };

    loadAdoptionApplications();
    loadFosterApplications();
  }, []);

  const toggleApplicationDetails = (id) => {
    setExpandedApplicationId(expandedApplicationId === id ? null : id);
  };

  // Filter applications based on selected status tab
  const filteredApplications = (
    activeMainTab === "adoption" ? adoptionApplications : fosterApplications
  ).filter(
    (app) =>
      activeStatusTab === "all" ||
      app.status?.toLowerCase().trim() === activeStatusTab
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={20} className="text-green-500" />;
      case "rejected":
        return <XCircle size={20} className="text-red-500" />;
      case "pending":
      default:
        return <Clock size={20} className="text-yellow-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const ApplicationCard = ({ application }) => (
    <div
      key={application._id}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
    >
      <div
        className="p-6 cursor-pointer hover:bg-gray-50"
        onClick={() => toggleApplicationDetails(application._id)}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={
                application.pet?.photos?.[0]?.url ||
                "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
              }
              alt={application.pet?.name}
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {activeMainTab === "adoption"
                  ? `Application for ${application.pet?.name || "Pet"}`
                  : `Foster Application for ${application.pet?.name || "Pet"}`}
              </h3>
              <p className="text-sm text-gray-500">
                Submitted on{" "}
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                application.status
              )}`}
            >
              {getStatusIcon(application.status)}
              <span className="ml-1 capitalize">{application.status}</span>
            </span>
            <ChevronDown
              size={20}
              className={`ml-2 text-gray-500 transition-transform ${
                expandedApplicationId === application._id
                  ? "transform rotate-180"
                  : ""
              }`}
            />
          </div>
        </div>
      </div>

      {expandedApplicationId === application._id && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Pet Information
              </h4>
              <div className="bg-white p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <img
                    src={
                      application.pet?.photos?.[0]?.url ||
                      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                    }
                    alt={application.pet?.name}
                    className="h-16 w-16 rounded-md object-cover mr-4"
                  />
                  <div>
                    <h5 className="font-medium">
                      {application.pet?.name || "Pet"}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {application.pet?.breed || "Unknown breed"},{" "}
                      {application.pet?.age
                        ? `${application.pet.age.value} ${application.pet.age.unit}`
                        : "Unknown age"}
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
              <h4 className="font-medium text-gray-700 mb-2">
                Application Details
              </h4>
              <div className="bg-white p-4 rounded-md space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Housing</p>
                  <p className="font-medium capitalize">
                    {application.housing || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Has Children</p>
                  <p className="font-medium">
                    {application.hasChildren === "yes" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Has Other Pets</p>
                  <p className="font-medium">
                    {application.hasOtherPets === "yes" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Schedule</p>
                  <p className="font-medium capitalize">
                    {application.workSchedule || "Not specified"}
                  </p>
                </div>

                {activeMainTab === "foster" && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Foster Duration</p>
                      <p className="font-medium">
                        {application.fosterDuration || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Experience with Pets
                      </p>
                      <p className="font-medium">
                        {application.experience || "Not specified"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {application.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mt-6">
              <div className="flex">
                <Clock size={20} className="text-yellow-600 flex-shrink-0" />
                <div className="ml-3">
                  <h5 className="text-yellow-800 font-medium">
                    Application Under Review
                  </h5>
                  <p className="text-yellow-700 text-sm">
                    Your application is being reviewed by the shelter. You
                    should receive a response within 2-3 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {application.status === "approved" && (
            <div className="bg-green-50 border border-green-100 rounded-md p-4 mt-6">
              <div className="flex">
                <CheckCircle
                  size={20}
                  className="text-green-600 flex-shrink-0"
                />
                <div className="ml-3">
                  <h5 className="text-green-800 font-medium">
                    Application Approved!
                  </h5>
                  <p className="text-green-700 text-sm">
                    Congratulations! The shelter has approved your application.
                    They will contact you soon to schedule a meet and greet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {application.status === "rejected" && (
            <div className="bg-red-50 border border-red-100 rounded-md p-4 mt-6">
              <div className="flex">
                <XCircle size={20} className="text-red-600 flex-shrink-0" />
                <div className="ml-3">
                  <h5 className="text-red-800 font-medium">
                    Application Not Approved
                  </h5>
                  <p className="text-red-700 text-sm">
                    We're sorry, your application was not approved at this time.
                    Please contact the shelter for more information.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button to={`/pets/${application.pet?._id}`} variant="outline">
              View Pet
            </Button>
            <Button variant="primary" icon={<MessageCircle size={18} />}>
              Contact Shelter
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage your pet adoption and foster applications
          </p>
        </div>

        {/* Main Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveMainTab("adoption");
                setActiveStatusTab("all");
                setExpandedApplicationId(null);
              }}
              className={`pb-4 px-1 ${
                activeMainTab === "adoption"
                  ? "border-b-2 border-purple-500 text-purple-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              }`}
            >
              Adoption Applications
            </button>
            <button
              onClick={() => {
                setActiveMainTab("foster");
                setActiveStatusTab("all");
                setExpandedApplicationId(null);
              }}
              className={`pb-4 px-1 ${
                activeMainTab === "foster"
                  ? "border-b-2 border-purple-500 text-purple-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              }`}
            >
              Foster Applications
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-6 text-sm font-medium text-gray-500">
            {["all", "pending", "approved", "rejected"].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => {
                  setActiveStatusTab(statusKey);
                  setExpandedApplicationId(null);
                }}
                className={`pb-3 ${
                  activeStatusTab === statusKey
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "hover:text-gray-700 border-transparent"
                }`}
              >
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Application List */}
        {loadingAdoption || loadingFoster ? (
          <p className="text-center text-gray-500">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p className="text-center text-gray-500">No applications found.</p>
        ) : (
          filteredApplications.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
