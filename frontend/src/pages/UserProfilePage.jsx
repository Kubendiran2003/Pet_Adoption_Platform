import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Home, Camera, Key } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { toast } from "react-hot-toast";
import { PawPrint } from "lucide-react";

const UserProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        avatar: currentUser.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        password: formData.newPassword || undefined, // send only if set
      };

      // Clean up unused fields before sending
      delete payload.newPassword;
      delete payload.confirmPassword;
      delete payload.currentPassword;

      const success = await updateProfile(payload);
      if (success) {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-purple-600">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <img
                  src={
                    formData.avatar ||
                    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                  }
                  alt={formData.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full">
                    <Camera size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.name}
                </h1>
                <p className="text-gray-600">{formData.email}</p>
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<User size={18} className="text-gray-400" />}
                    />

                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Mail size={18} className="text-gray-400" />}
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Phone size={18} className="text-gray-400" />}
                    />

                    <Input
                      label="Address"
                      type="text"
                      name="address"
                      value={
                        typeof formData.address === "object"
                          ? `${formData.address.city || ""}, ${
                              formData.address.state || ""
                            }, ${formData.address.country || ""}`
                          : formData.address || ""
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Home size={18} className="text-gray-400" />}
                    />
                  </div>
                </div>

                {/* Password Change */}
                {isEditing && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        icon={<Key size={18} className="text-gray-400" />}
                      />

                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="New Password"
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          icon={<Key size={18} className="text-gray-400" />}
                        />

                        <Input
                          label="Confirm New Password"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          icon={<Key size={18} className="text-gray-400" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
