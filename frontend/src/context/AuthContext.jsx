import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchCurrentUser();
    } else {
      setCurrentUser(null);
      setLoading(false);
      localStorage.removeItem('token');
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/profile');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/api/users/login', { email, password });
      setToken(response.data.token);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/users', userData);
      setToken(response.data.token);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    toast.success('Logged out successfully!');
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/api/users/profile', userData);
      setCurrentUser(response.data);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Additional methods that match your API
  const fetchShelters = async () => {
    try {
      const response = await api.get('/api/users/shelters');
      return response.data;
    } catch (error) {
      console.error('Error fetching shelters:', error);
      throw error;
    }
  };

  const fetchShelterById = async (id) => {
    try {
      const response = await api.get(`/api/users/shelters/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shelter:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    fetchShelters,
    fetchShelterById,
    isAuthenticated: !!token,
    isShelter: currentUser?.role === 'shelter',
    isAdmin: currentUser?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};