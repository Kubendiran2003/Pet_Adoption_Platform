import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { startConversation } from "../../services/api";
import Button from "../common/Button";

const ContactShelterButton = ({ shelterId, petId, petName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleContactShelter = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to contact the shelter");
      navigate("/login");
      return;
    }

    if (!shelterId) {
      toast.error("Shelter information is not available");
      return;
    }

    setIsLoading(true);
    try {
      const conversation = await startConversation(
        shelterId,
        `Hi, I'm interested in adopting ${petName} `
      );

      navigate("/messages", {
        state: {
          newConversationId: conversation._id,
          shouldHighlight: true,
        },
      });

      toast.success(`Started conversation about ${petName}`);
    } catch (error) {
      console.error("Contact shelter error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to start conversation";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!shelterId) {
    return (
      <Button variant="outline" fullWidth disabled>
        <MessageCircle size={18} className="mr-2" />
        Shelter contact unavailable
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      fullWidth
      onClick={handleContactShelter}
      disabled={isLoading}
    >
      <MessageCircle size={18} className="mr-2" />
      {isLoading ? "Connecting..." : "Contact Shelter"}
    </Button>
  );
};

export default ContactShelterButton;
