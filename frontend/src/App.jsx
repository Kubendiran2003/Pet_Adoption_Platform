import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import PetListingPage from "./pages/PetListingPage";
import PetDetailsPage from "./pages/PetDetailsPage";
import AddPetPage from "./pages/AddPetPage";
import EditPetPage from "./pages/EditPetPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import ApplicationsPage from "./pages/ApplicationsPage";
import FosterApplicationForm from "./components/applications/FosterApplicationForm";
import FavoritesPage from "./pages/FavoritesPage";
import ShelterDashboardPage from "./pages/ShelterDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import FosterProgramPage from "./pages/FosterProgramPage";
import MessagesPage from "./pages/MessagesPage";
import AboutPage from "./pages/AboutPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-purple-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pets" element={<PetListingPage />} />
              <Route path="/pets/:id" element={<PetDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <ApplicationsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shelter-dashboard"
                element={
                  <ProtectedRoute requireShelter={true}>
                    <ShelterDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-pet"
                element={
                  <ProtectedRoute requireShelter={true}>
                    <AddPetPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-pet/:id"
                element={
                  <ProtectedRoute requireShelter={true}>
                    <EditPetPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pets/:petId/foster"
                element={
                  <ProtectedRoute>
                    <FosterApplicationForm />
                  </ProtectedRoute>
                }
              />

              <Route path="/foster-program" element={<FosterProgramPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate replace to="/404" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
