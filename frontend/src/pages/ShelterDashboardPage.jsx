import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Edit,
  Trash,
  MessageCircle,
  Home,
} from "lucide-react";
import {
  fetchShelterPets,
  fetchShelterApplications,
  getShelterFosterApplications,
  deletePet,
  approveApplication,
  rejectApplication,
  approveFosterApplication,
  rejectFosterApplication,
} from "../services/api";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import { ConfirmModal } from "../components/common/Modal";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const ShelterDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("pets");
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [fosterApplications, setFosterApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [appActionLoadingId, setAppActionLoadingId] = useState(null);
  const [shelterId, setShelterId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Get shelterId from user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData._id) {
      setShelterId(userData._id);
    } else {
      console.error("No user data or missing _id");
    }
  }, []);

  // Load pets and applications data when shelterId changes
  useEffect(() => {
    if (!shelterId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const petsResponse = await fetchShelterPets(shelterId);
        const applicationsResponse = await fetchShelterApplications();
        const fosterAppsResponse = await getShelterFosterApplications();

        setPets(petsResponse.data || []);
        setApplications(applicationsResponse.data || []);
        setFosterApplications(fosterAppsResponse.data || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [shelterId]);

  const handleDeletePet = async (petId) => {
    if (window.confirm(`Are you sure you want to delete this pet?`)) {
      try {
        await deletePet(petId);
        setPets((prev) => prev.filter((pet) => pet._id !== petId));
        toast.success("Pet deleted successfully");
      } catch (error) {
        toast.error("Failed to delete pet");
      }
    }
  };

  const confirmDeletePet = async () => {
    if (!selectedPetId) {
      console.error("No pet selected for deletion");
      toast.error("No pet selected for deletion");
      return;
    }

    setActionLoading(true);
    try {
      await deletePet(selectedPetId);
      setPets((prevPets) =>
        prevPets.filter((pet) => pet._id !== selectedPetId)
      );
      toast.success(`Pet deleted successfully`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete pet");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setSelectedPetId(null);
    }
  };

  const handleApprove = async (appId) => {
    setAppActionLoadingId(appId);
    try {
      const updatedApp = await approveApplication(appId);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: updatedApp.status } : app
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setAppActionLoadingId(null);
    }
  };

  const handleReject = async (appId) => {
    setAppActionLoadingId(appId);
    try {
      await rejectApplication(appId);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: "Denied" } : app
        )
      );
      toast.success("Application rejected successfully");
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to reject application"
      );
    } finally {
      setAppActionLoadingId(null);
    }
  };

  const handleApproveFoster = async (appId) => {
    setAppActionLoadingId(appId);
    try {
      const updatedApp = await approveFosterApplication(appId);
      setFosterApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: updatedApp.status } : app
        )
      );
      toast.success("Foster application approved");
    } catch (error) {
      console.error("Error approving foster:", error);
      toast.error(error.response?.data?.error || "Failed to approve foster");
    } finally {
      setAppActionLoadingId(null);
    }
  };

  const handleRejectFoster = async (appId) => {
    setAppActionLoadingId(appId);
    try {
      await rejectFosterApplication(appId);
      setFosterApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: "Rejected" } : app
        )
      );
      toast.success("Foster application rejected");
    } catch (error) {
      console.error("Error rejecting foster:", error);
      toast.error(error.response?.data?.message || "Failed to reject foster");
    } finally {
      setAppActionLoadingId(null);
    }
  };

  // Filters
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus ? pet.status === filterStatus : true)
  );

  const filteredApplications = Array.isArray(applications)
    ? applications.filter(
        (app) =>
          app.pet?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterStatus ? app.status === filterStatus : true)
      )
    : [];

  const filteredFosterApplications = Array.isArray(fosterApplications)
    ? fosterApplications.filter(
        (app) =>
          app.pet?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterStatus ? app.status === filterStatus : true)
      )
    : [];

  // Counts for dashboard summary
  const totalPets = pets.length;
  const totalApplications = applications.length;
  const totalFosterApplications = fosterApplications.length;
  const adoptedCount = applications.filter(
    (app) => app.status === "Approved"
  ).length;
  const fosteredCount = applications.filter(
    (app) => app.status === "Approved"
  ).length;
  const pendingCount = applications.filter(
    (app) =>
      app.status === "Submitted" ||
      app.status === "Under Review" ||
      app.status === "Pending"
  ).length;
  const pendingFosterCount = fosterApplications.filter(
    (app) =>
      app.status === "Submitted" ||
      app.status === "Under Review" ||
      app.status === "Pending"
  ).length;

  useEffect(() => {
    const loadData = async () => {
      if (!shelterId) return;

      setLoading(true);
      try {
        const [petsResponse, appsResponse, fosterAppsResponse] =
          await Promise.all([
            fetchShelterPets(shelterId),
            fetchShelterApplications(),
            getShelterFosterApplications(),
          ]);

        if (location.state?.updatedPet) {
          setPets((prev) =>
            prev.map((pet) =>
              pet._id === location.state.updatedPet._id
                ? location.state.updatedPet
                : pet
            )
          );
        } else {
          setPets(petsResponse.data || []);
        }

        setApplications(appsResponse.data || []);
        setFosterApplications(fosterAppsResponse.data || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);

        if (location.state?.refresh || location.state?.updatedPet) {
          navigate(location.pathname, { replace: true, state: {} });
        }
      }
    };

    loadData();
  }, [shelterId, location.state]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shelter Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your pets, adoption and foster applications
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button to="/add-pet" variant="primary" icon={<Plus size={18} />}>
                Add New Pet
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3">
                  <PawPrint className="text-purple-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Pets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPets}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Adoption Apps</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalApplications}
                  </p>
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
                    {adoptedCount + fosteredCount}
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
                    {pendingCount + pendingFosterCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-full p-3">
                  <Home className="text-orange-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Foster Apps</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalFosterApplications}
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
                onClick={() => setActiveTab("pets")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "pets"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={activeTab === "pets" ? "page" : undefined}
              >
                Pets
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "applications"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={activeTab === "applications" ? "page" : undefined}
              >
                Adoption Applications
              </button>
              <button
                onClick={() => setActiveTab("foster-applications")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "foster-applications"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={
                  activeTab === "foster-applications" ? "page" : undefined
                }
              >
                Foster Applications
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={`Search ${
                    activeTab === "pets"
                      ? "pets"
                      : activeTab === "applications"
                      ? "adoption applications"
                      : "foster applications"
                  }...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} className="text-gray-400" />}
                  aria-label={`Search ${activeTab}`}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={
                    activeTab === "pets"
                      ? [
                          { value: "", label: "All Statuses" },
                          { value: "Available", label: "Available" },
                          { value: "Pending", label: "Pending" },
                          { value: "Approved", label: "Adopted" },
                          { value: "Fostered", label: "Fostered" },
                        ]
                      : activeTab === "applications"
                      ? [
                          { value: "", label: "All Statuses" },
                          { value: "Submitted", label: "Submitted" },
                          { value: "Under Review", label: "Under Review" },
                          { value: "Approved", label: "Approved" },
                          { value: "Denied", label: "Denied" },
                        ]
                      : [
                          { value: "", label: "All Statuses" },
                          { value: "Pending", label: "Pending" },
                          { value: "Approved", label: "Approved" },
                          { value: "Rejected", label: "Rejected" },
                          { value: "Completed", label: "Completed" },
                        ]
                  }
                  aria-label={`Filter ${activeTab} by status`}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-50 p-4 rounded-lg"
                  >
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
            ) : activeTab === "pets" ? (
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
                              src={
                                pet.photos?.[0]?.url ||
                                "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                              }
                              alt={pet.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {pet.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {pet.breed}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pet.status === "Available"
                                ? "bg-green-100 text-green-800"
                                : pet.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : pet.status === "Fostered"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {pet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {pet.applications?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(pet.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                            to={`/edit-pet/${pet._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            aria-label={`Edit ${pet.name}`}
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeletePet(pet._id);
                            }}
                            disabled={actionLoading}
                            className={`text-red-600 hover:text-red-900 transition-colors ${
                              actionLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            aria-label={`Delete ${pet.name}`}
                            data-testid={`delete-pet-${pet._id}`}
                          >
                            {actionLoading && selectedPetId === pet._id ? (
                              <span className="animate-spin">🌀</span>
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPets.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-500 italic"
                        >
                          No pets found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === "applications" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((app) => (
                      <tr key={app._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {app.user?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                app.pet.photos?.[0]?.url ||
                                "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                              }
                              alt={app.pet?.name || "Pet"}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.pet?.name || "Unknown Pet"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {app.pet?.breed}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === "Submitted" ||
                              app.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {app.status === "Submitted" ||
                          app.status === "Pending" ||
                          app.status === "Under Review" ? (
                            <>
                              <button
                                onClick={() => handleApprove(app._id)}
                                disabled={appActionLoadingId === app._id}
                                className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                aria-label={`Approve application from ${app.user?.name}`}
                              >
                                {appActionLoadingId === app._id
                                  ? "Approving..."
                                  : "Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(app._id)}
                                disabled={appActionLoadingId === app._id}
                                className="inline-flex items-center px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                aria-label={`Reject application from ${app.user?.name}`}
                              >
                                {appActionLoadingId === app._id
                                  ? "Rejecting..."
                                  : "Reject"}
                              </button>
                            </>
                          ) : (
                            <span className="italic text-gray-600">
                              No actions
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredApplications.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-500 italic"
                        >
                          No adoption applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFosterApplications.map((app) => (
                      <tr key={app._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {app.user?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                app.pet.photos?.[0]?.url ||
                                "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                              }
                              alt={app.pet?.name || "Pet"}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.pet?.name || "Unknown Pet"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {app.pet?.breed}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === "Submitted" ||
                              app.status === "Pending" ||
                              app.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : app.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>
                              Start:{" "}
                              {new Date(app.startDate).toLocaleDateString()}
                            </div>
                            <div>
                              End: {new Date(app.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {app.status === "Submitted" ||
                          app.status === "Pending" ||
                          app.status === "Under Review" ? (
                            <>
                              <button
                                onClick={() => handleApproveFoster(app._id)}
                                disabled={appActionLoadingId === app._id}
                                className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                aria-label={`Approve foster application from ${app.user?.name}`}
                              >
                                {appActionLoadingId === app._id
                                  ? "Approving..."
                                  : "Approve"}
                              </button>
                              <button
                                onClick={() => handleRejectFoster(app._id)}
                                disabled={appActionLoadingId === app._id}
                                className="inline-flex items-center px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                aria-label={`Reject foster application from ${app.user?.name}`}
                              >
                                {appActionLoadingId === app._id
                                  ? "Rejecting..."
                                  : "Reject"}
                              </button>
                            </>
                          ) : (
                            <span className="italic text-gray-600">
                              No actions
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredFosterApplications.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-500 italic"
                        >
                          No foster applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Pet"
          message="Are you sure you want to delete this pet? This action cannot be undone."
          onConfirm={confirmDeletePet}
          onCancel={() => setShowDeleteModal(false)}
          confirmLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default ShelterDashboardPage;
