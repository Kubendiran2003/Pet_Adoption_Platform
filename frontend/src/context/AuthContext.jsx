import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        localStorage.setItem("token", token);
        await fetchCurrentUser();
      } else {
        setCurrentUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users/profile");
      setCurrentUser(response.data);
      localStorage.setItem("userId", response.data._id);
      localStorage.setItem("user", JSON.stringify(response.data)); // ✅ Store user
    } catch (error) {
      console.error("Error fetching current user:", error);
      setToken(null); // Trigger useEffect cleanup
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/api/users/login", { email, password });
      const token = response.data.token;
      setToken(token);
      const decoded = jwtDecode(token);
      localStorage.setItem("userId", decoded.id);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to login";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/api/users", userData);
      const token = response.data.token;
      setToken(token);
      const decoded = jwtDecode(token);
      localStorage.setItem("userId", decoded.id || decoded._id);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to register";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user"); // ✅ Clear user
    toast.success("Logged out successfully!");
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put("/api/users/profile", userData);
      setCurrentUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data)); // ✅ Update local user
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchShelters = async () => {
    try {
      const response = await api.get("/api/users/shelters");
      return response.data;
    } catch (error) {
      console.error("Error fetching shelters:", error);
      throw error;
    }
  };

  const fetchShelterById = async (id) => {
    try {
      const response = await api.get(`/api/users/shelters/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching shelter:", error);
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
    isShelter: currentUser?.role === "shelter",
    isAdmin: currentUser?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
