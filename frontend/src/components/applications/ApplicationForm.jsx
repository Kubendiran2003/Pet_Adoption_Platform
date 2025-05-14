import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { submitApplication } from '../../services/api';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';

const ApplicationForm = ({ petId, petName, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    housing: '',
    hasYard: '',
    hasChildren: '',
    hasOtherPets: '',
    otherPetDetails: '',
    workSchedule: '',
    experience: '',
    reasonForAdopting: '',
    questions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const applicationData = {
        ...formData,
        petId,
      };
      await submitApplication(applicationData);
      toast.success("Application submitted successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const housingOptions = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'other', label: 'Other' }
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  const workScheduleOptions = [
    { value: 'full-time-office', label: 'Full-time (Office)' },
    { value: 'full-time-remote', label: 'Full-time (Remote)' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'not-working', label: 'Not Working' },
    { value: 'other', label: 'Other' }
  ];

  const experienceOptions = [
    { value: 'first-time', label: 'First-time pet owner' },
    { value: 'some', label: 'Some experience' },
    { value: 'experienced', label: 'Experienced' },
    { value: 'professional', label: 'Professional/Expert' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Adoption Application</h2>
      <p className="text-gray-600 mb-6">for {petName}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Living Situation</h3>
          </div>
          
          <Select
            label="What type of housing do you live in?"
            id="housing"
            name="housing"
            value={formData.housing}
            onChange={handleChange}
            options={housingOptions}
            required
          />
          
          <Select
            label="Do you have a yard?"
            id="hasYard"
            name="hasYard"
            value={formData.hasYard}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />
          
          <Select
            label="Do you have children in your home?"
            id="hasChildren"
            name="hasChildren"
            value={formData.hasChildren}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />
          
          <Select
            label="Do you have other pets?"
            id="hasOtherPets"
            name="hasOtherPets"
            value={formData.hasOtherPets}
            onChange={handleChange}
            options={yesNoOptions}
            required
          />
          
          {formData.hasOtherPets === 'yes' && (
            <div className="md:col-span-2">
              <TextArea
                label="Please describe your current pets"
                id="otherPetDetails"
                name="otherPetDetails"
                value={formData.otherPetDetails}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          )}
          
          <div className="md:col-span-2 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Lifestyle & Experience</h3>
          </div>
          
          <Select
            label="What is your work schedule like?"
            id="workSchedule"
            name="workSchedule"
            value={formData.workSchedule}
            onChange={handleChange}
            options={workScheduleOptions}
            required
          />
          
          <Select
            label="What is your pet ownership experience?"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            options={experienceOptions}
            required
          />
          
          <div className="md:col-span-2">
            <TextArea
              label="Why are you interested in adopting this pet?"
              id="reasonForAdopting"
              name="reasonForAdopting"
              value={formData.reasonForAdopting}
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
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            By submitting this application, you agree to our adoption process and acknowledge 
            that further information may be requested. We typically respond within 48 hours.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;