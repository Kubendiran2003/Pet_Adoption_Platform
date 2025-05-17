import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { submitApplication } from "../../services/api";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Select from "../common/Select";
import Button from "../common/Button";

const ApplicationForm = ({ petId, petName, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicantInfo: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA", // Default value
      },
    },
    housingInfo: {
      type: "",
      own: "",
      hasYard: "",
      hasChildren: "",
      hasOtherPets: "",
    },
    lifestyle: {
      hoursAlone: "",
      activityLevel: "",
      primaryCaregiver: "Self",
      experience: "",
      reasonForAdopting: "",
    },
    questions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.startsWith("applicantInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        applicantInfo: {
          ...prev.applicantInfo,
          [field]: value,
        },
      }));
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        applicantInfo: {
          ...prev.applicantInfo,
          address: {
            ...prev.applicantInfo.address,
            [field]: value,
          },
        },
      }));
    } else if (name.startsWith("housingInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        housingInfo: {
          ...prev.housingInfo,
          [field]: value,
        },
      }));
    } else if (name.startsWith("lifestyle.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applicationData = {
        pet: petId, // Changed from petId to pet to match API
        ...formData,
      };

      await submitApplication(applicationData);
      toast.success("Application submitted successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const housingOptions = [
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Condo", label: "Condo" },
    { value: "Other", label: "Other" },
  ];

  const yesNoOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const activityLevelOptions = [
    { value: "Low", label: "Low" },
    { value: "Moderate", label: "Moderate" },
    { value: "High", label: "High" },
  ];

  const experienceOptions = [
    { value: "First-time", label: "First-time pet owner" },
    { value: "Some", label: "Some experience" },
    { value: "Experienced", label: "Experienced" },
    { value: "Professional", label: "Professional/Expert" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Adoption Application
      </h2>
      <p className="text-gray-600 mb-6">for {petName}</p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Personal Information
            </h3>
          </div>

          <Input
            label="Full Name"
            id="applicantInfo.name"
            name="applicantInfo.name"
            value={formData.applicantInfo.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            id="applicantInfo.email"
            name="applicantInfo.email"
            type="email"
            value={formData.applicantInfo.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            id="applicantInfo.phone"
            name="applicantInfo.phone"
            value={formData.applicantInfo.phone}
            onChange={handleChange}
            required
          />

          <Input
            label="Street Address"
            id="address.street"
            name="address.street"
            value={formData.applicantInfo.address.street}
            onChange={handleChange}
            required
          />

          <Input
            label="City"
            id="address.city"
            name="address.city"
            value={formData.applicantInfo.address.city}
            onChange={handleChange}
            required
          />

          <Input
            label="State"
            id="address.state"
            name="address.state"
            value={formData.applicantInfo.address.state}
            onChange={handleChange}
            required
          />

          <Input
            label="ZIP Code"
            id="address.zipCode"
            name="address.zipCode"
            value={formData.applicantInfo.address.zipCode}
            onChange={handleChange}
            required
          />

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Living Situation
            </h3>
          </div>

          <Select
            label="What type of housing do you live in?"
            id="housingInfo.type"
            name="housingInfo.type"
            value={formData.housingInfo.type}
            onChange={handleChange}
            options={housingOptions}
            required
          />

          <Select
            label="Do you own your home?"
            id="housingInfo.own"
            name="housingInfo.own"
            value={formData.housingInfo.own}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />

          <Select
            label="Do you have a yard?"
            id="housingInfo.hasYard"
            name="housingInfo.hasYard"
            value={formData.housingInfo.hasYard}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />

          <Select
            label="Do you have children in your home?"
            id="housingInfo.hasChildren"
            name="housingInfo.hasChildren"
            value={formData.housingInfo.hasChildren}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />

          <Select
            label="Do you have other pets?"
            id="housingInfo.hasOtherPets"
            name="housingInfo.hasOtherPets"
            value={formData.housingInfo.hasOtherPets}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Lifestyle & Experience
            </h3>
          </div>

          <Input
            label="How many hours will the pet be alone daily?"
            id="lifestyle.hoursAlone"
            name="lifestyle.hoursAlone"
            type="number"
            value={formData.lifestyle.hoursAlone}
            onChange={handleChange}
            required
          />

          <Select
            label="Activity Level"
            id="lifestyle.activityLevel"
            name="lifestyle.activityLevel"
            value={formData.lifestyle.activityLevel}
            onChange={handleChange}
            options={activityLevelOptions}
            required
          />

          <Select
            label="Pet Ownership Experience"
            id="lifestyle.experience"
            name="lifestyle.experience"
            value={formData.lifestyle.experience}
            onChange={handleChange}
            options={experienceOptions}
            required
          />

          <div className="md:col-span-2">
            <TextArea
              label="Why are you interested in adopting this pet?"
              id="lifestyle.reasonForAdopting"
              name="lifestyle.reasonForAdopting"
              value={formData.lifestyle.reasonForAdopting}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Do you have any questions about this pet?"
              id="questions"
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto md:min-w-[200px]"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            By submitting this application, you agree to our adoption process
            and acknowledge that further information may be requested. We
            typically respond within 48 hours.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
