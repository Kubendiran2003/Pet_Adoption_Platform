import axios from 'axios';

const API_URL = 'https://pet-adoption-platform-m3t7.onrender.com';

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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Pets API
export const fetchPets = async (params = {}) => {
  try {
    const response = await api.get('/api/pets', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

export const fetchPetById = async (id) => {
  try {
    const response = await api.get(`/api/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pet with id ${id}:`, error);
    throw error;
  }
};

// Applications API
export const submitApplication = async (applicationData) => {
  try {
    const response = await api.post('/api/applications', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const fetchUserApplications = async () => {
  try {
    const response = await api.get('/api/applications/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};

// Favorites API
export const addFavorite = async (petId) => {
  try {
    const response = await api.post('/api/favorites', { petId });
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (petId) => {
  try {
    const response = await api.delete(`/api/favorites/${petId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const fetchUserFavorites = async () => {
  try {
    const response = await api.get('/api/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
};

// Shelter API
export const fetchShelterPets = async () => {
  try {
    const response = await api.get('/api/shelters/pets');
    return response.data;
  } catch (error) {
    console.error('Error fetching shelter pets:', error);
    throw error;
  }
};

export const fetchShelterApplications = async () => {
  try {
    const response = await api.get('/api/shelters/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching shelter applications:', error);
    throw error;
  }
};

// Reviews API
export const fetchReviews = async (entityId, entityType) => {
  try {
    const response = await api.get(`/api/reviews`, {
      params: { entityId, entityType }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Messages API
export const fetchConversations = async () => {
  try {
    const response = await api.get('/api/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const response = await api.get(`/api/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (conversationId, content) => {
  try {
    const response = await api.post(`/api/messages/${conversationId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const startConversation = async (recipientId, initialMessage) => {
  try {
    const response = await api.post('/api/messages/start', {
      recipientId,
      content: initialMessage
    });
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};