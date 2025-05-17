import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'https://pet-adoption-platform-fzxz.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default api;

//
// PETS API
//
export const fetchPets = async (params = {}) => {
  try {
    const response = await api.get('/api/pets', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

export const searchPets = async (query) => {
  try {
    const response = await api.get('/api/pets/search', { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Error searching pets:', error);
    throw error;
  }
};

export const fetchPetById = async (id) => {
  try {
    const response = await api.get(`/api/pets/${id}`);
    
    if (!response || !response.data || !response.data._id) {
      const error = new Error(response?.data?.message || 'No valid pet data received');
      error.response = response;
      throw error;
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error fetching pet:', {
      url: `/api/pets/${id}`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const createPet = async (petData) => {
  try {
    const response = await api.post('/api/pets', petData);
    return response.data;
  } catch (error) {
    console.error('Error creating pet:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePet = async (id, petData) => {
  try {
    // Convert FormData to JSON if needed
    const jsonData = formDataToJson(petData);
    
    const response = await api.put(`/api/pets/${id}`, jsonData, {
      headers: {
        'Content-Type': 'application/json', // Ensure JSON content type
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update Pet Error:', error.response?.data || error.message);
    throw error;
  }
};

const formDataToJson = (formData) => {
  const json = {};
  for (const [key, value] of formData.entries()) {
    // Handle nested fields (location.country, age.value, etc.)
    if (key.includes('[') && key.includes(']')) {
      const [parent, child] = key.split(/\[|\]/).filter(Boolean);
      if (!json[parent]) json[parent] = {};
      json[parent][child] = value;
    } else {
      json[key] = value;
    }
  }
  return json;
};

//
// APPLICATIONS API
//
export const submitApplication = async (applicationData) => {
  try {
    // First verify pet exists
    await api.get(`/api/pets/${applicationData.pet}`);
    
    // Then submit application
    const response = await api.post('/api/applications', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error.response?.data || error.message);
    
    // Add more specific error handling
    if (error.response?.data?.error === 'Pet not found') {
      throw new Error('The pet you\'re trying to adopt is no longer available');
    }
    
    throw error;
  }
};

export const fetchUserApplications = async () => {
  try {
    const response = await api.get('/api/applications/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user applications:', error.response?.data || error.message);
    throw error;
  }
};

//
// FAVORITES API
//
export const toggleSavedPet = async (petId) => {
  try {
    const response = await api.post('/api/users/savedPets', { petId });
    return response.data;
  } catch (error) {
    console.error('Error toggling saved pet:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch all saved pets
export const fetchUserFavorites = async () => {
  try {
    const response = await api.get('/api/users/savedPets');
    return response.data;
  } catch (error) {
    console.error('Error fetching user favorites:', error.response?.data || error.message);
    throw error;
  }
};


//
// SHELTER API
//
export const fetchShelterPets = async (shelterId) => {
  try {
    const response = await api.get(`/api/pets/shelter/${shelterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shelter pets:', error);
    throw error;
  }
};


export const fetchShelterApplications = async () => {
  try {
    const response = await api.get('/api/applications/shelter');
    return response.data;
  } catch (error) {
    console.error('Error fetching shelter applications:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePet = async (petId) => {
  try {
    const response = await api.delete(`/api/pets/${petId}`);
    return response.data;
  } catch (error) {
    console.error("API Delete Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// Update the approve and reject application functions
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await api.put(`/api/applications/${applicationId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const approveApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'Approved');
};

export const rejectApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'Denied');
};

//
// REVIEWS API
//
export const fetchReviews = async (entityId, entityType) => {
  try {
    let url = '';

    if (entityType === 'pet') {
      url = `/api/reviews/pet/${entityId}`;
    } else if (entityType === 'shelter') {
      url = `/api/reviews/shelter/${entityId}`;
    } else {
      throw new Error('Invalid entity type');
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error.response?.data || error.message);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw error;
  }
};

//
// MESSAGES API
//
export const fetchConversations = async () => {
  try {
    const response = await api.get('/api/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const response = await api.get(`/api/messages/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.response?.data || error.message);
    throw error;
  }
};

export const sendMessage = async (conversationId, content) => {
  try {
    const response = await api.post(`/api/messages/conversations/${conversationId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
};

export const startConversation = async (recipientId, initialMessage, petId = null) => {
  try {
    const response = await api.post('/api/messages/conversations', {
      recipient: recipientId,
      initialMessage,
      ...(petId && { petId }),
      ...(petId && { subject: `Question about pet ${petId}` }) // Add subject if needed
    });
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error.response?.data || error.message);
    throw error;
  }
};

//
// FOSTER API
//

/**
 * @desc    Create a foster application
 * @param   {Object} applicationData - { pet: petId, startDate, endDate, notes }
 * @return  {Object} - Created foster application
 */
export const createFosterApplication = async (applicationData) => {
  try {
    // First verify pet exists and is available for fostering
    await api.get(`/api/pets/${applicationData.pet}`);
    
    const response = await api.post('/api/fosters', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error creating foster application:', error.response?.data || error.message);
    
    // Add specific error handling
    if (error.response?.data?.error === 'Pet not found') {
      throw new Error('The pet you\'re trying to foster is no longer available');
    }
    if (error.response?.data?.error?.includes('already have a pending')) {
      throw new Error('You already have a pending foster application for this pet');
    }
    
    throw error;
  }
};

//
// Foster API
//
export const getUserFosterApplications = async () => {
  try {
    const response = await api.get('/api/fosters/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user foster applications:', error.response?.data || error.message);
    throw error;
  }
};


export const getShelterFosterApplications = async (params = {}) => {
  try {
    const response = await api.get('/api/fosters/shelter', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching shelter foster applications:', error.response?.data || error.message);
    throw error;
  }
};


export const getFosterApplicationById = async (id) => {
  try {
    const response = await api.get(`/api/fosters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching foster application:', error.response?.data || error.message);
    throw error;
  }
};


export const updateFosterStatus = async (id, status, feedback = {}) => {
  try {
    const response = await api.put(`/api/fosters/${id}/status`, { 
      status, 
      ...(feedback && { feedback }) 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating foster status:', error.response?.data || error.message);
    throw error;
  }
};


export const scheduleHomeCheck = async (id, date) => {
  try {
    const response = await api.post(`/api/fosters/${id}/homecheck`, { date });
    return response.data;
  } catch (error) {
    console.error('Error scheduling home check:', error.response?.data || error.message);
    throw error;
  }
};


export const completeHomeCheck = async (id, passed, comments = '') => {
  try {
    const response = await api.put(`/api/fosters/${id}/homecheck`, { 
      passed, 
      comments 
    });
    return response.data;
  } catch (error) {
    console.error('Error completing home check:', error.response?.data || error.message);
    throw error;
  }
};

export const submitFosterFeedback = async (id, rating, comments = '') => {
  try {
    const response = await api.post(`/api/fosters/${id}/feedback`, { 
      rating, 
      comments 
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting foster feedback:', error.response?.data || error.message);
    throw error;
  }
};

// Convenience functions for common status updates
export const approveFosterApplication = async (id, feedback) => {
  return updateFosterStatus(id, 'Approved', feedback);
};

export const rejectFosterApplication = async (id, feedback) => {
  return updateFosterStatus(id, 'Rejected', feedback);
};

export const completeFosterApplication = async (id, feedback) => {
  return updateFosterStatus(id, 'Completed', feedback);
};