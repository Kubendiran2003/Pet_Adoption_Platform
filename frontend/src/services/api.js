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
    
    if (!response.data) {
      throw new Error('No data returned from server');
    }
    
    return response;
  } catch (error) {
    console.error('API Error fetching pet:', {
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
    const response = await api.post('/api/applications', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error.response?.data || error.message);
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

export const startConversation = async (recipientId, initialMessage) => {
  try {
    const response = await api.post('/api/messages/conversations', {
      recipientId,
      content: initialMessage,
    });
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error.response?.data || error.message);
    throw error;
  }
};