import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { fetchPetById, createFosterApplication } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import TextArea from "../common/TextArea";

const FosterApplicationForm = () => {
  const { petId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pet, setPet] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pet: petId,
      startYear: "",
      startMonth: "",
      startDay: "",
      endYear: "",
      endMonth: "",
      endDay: "",
      notes: "",
    },
  });

  const startYear = watch("startYear");
  const startMonth = watch("startMonth");
  const startDay = watch("startDay");
  const endYear = watch("endYear");
  const endMonth = watch("endMonth");
  const endDay = watch("endDay");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const petData = await fetchPetById(petId);
        setPet(petData);
      } catch (error) {
        console.error("Error fetching pet:", error);
        toast.error("Failed to load pet details");
      }
    };

    if (petId) {
      fetchPet();
      setValue("pet", petId);
    }
  }, [petId, setValue]);

  const onSubmit = async (data) => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast.error("Please log in to submit a foster application");
      navigate("/login");
      return;
    }

    const startDate = `${data.startYear}-${data.startMonth}-${data.startDay}`;
    const endDate =
      data.endYear && data.endMonth && data.endDay
        ? `${data.endYear}-${data.endMonth}-${data.endDay}`
        : "";

    setIsLoading(true);
    try {
      const application = await createFosterApplication({
        pet: petId,
        startDate,
        endDate,
        notes: data.notes,
      });

      toast.success("Foster application submitted successfully!");
      reset();
      navigate(`/applications`);
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsLoading(false);
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear + i);
  };

  const generateMonths = () =>
    Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

  const generateDays = () =>
    Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

  if (!pet) {
    return <div className="text-center py-8">Loading pet details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Foster Application for {pet?.name || "this pet"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Pet Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Pet Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-gray-900">{pet.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <p className="text-gray-900">{pet.breed || "Unknown"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <p className="text-gray-900">
                {pet.age?.value && pet.age?.unit
                  ? `${pet.age.value} ${pet.age.unit}`
                  : "Unknown"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shelter
              </label>
              <p className="text-gray-900">{pet.shelter?.name || "Unknown"}</p>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Foster Period</h3>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                {...register("startYear", { required: true })}
                className="border p-2 rounded"
              >
                <option value="">Year</option>
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                {...register("startMonth", { required: true })}
                className="border p-2 rounded"
              >
                <option value="">Month</option>
                {generateMonths().map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                {...register("startDay", { required: true })}
                className="border p-2 rounded"
              >
                <option value="">Day</option>
                {generateDays().map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select {...register("endYear")} className="border p-2 rounded">
                <option value="">Year</option>
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select {...register("endMonth")} className="border p-2 rounded">
                <option value="">Month</option>
                {generateMonths().map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select {...register("endDay")} className="border p-2 rounded">
                <option value="">Day</option>
                {generateDays().map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave blank for open-ended fostering
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tell us about your experience and why you'd like to foster{" "}
            {pet.name} <span className="text-red-500">*</span>
          </label>
          <TextArea
            id="notes"
            rows={4}
            {...register("notes", {
              required: "Please provide some information about your experience",
              minLength: {
                value: 20,
                message: "Please provide at least 20 characters",
              },
            })}
            className="w-full"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Requirements */}
        {pet.fosterInfo?.requirements?.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Foster Requirements</h3>
            <ul className="space-y-2">
              {pet.fosterInfo.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FosterApplicationForm;
