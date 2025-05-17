import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register, loading } = useAuth(); // grab loading from context for button disabling
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role to 'user' (adopter)
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    bio: "",
  });

  const [isShowingShelterFields, setIsShowingShelterFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "role") {
        setIsShowingShelterFields(value === "shelter");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Prepare userData to send to backend
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "shelter") {
      userData.phone = formData.phone.trim();
      userData.address = {
        street: formData.address.street.trim(),
        city: formData.address.city.trim(),
        state: formData.address.state.trim(),
        zipCode: formData.address.zipCode.trim(),
        country: formData.address.country.trim(),
      };
      userData.bio = formData.bio.trim();
    }

    const success = await register(userData);
    if (success) {
      navigate("/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
          autoComplete="name"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
          minLength={6}
          autoComplete="new-password"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
          autoComplete="new-password"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        >
          <option value="user">Adopter</option>
          <option value="shelter">Shelter</option>
        </select>

        {isShowingShelterFields && (
          <>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
              autoComplete="tel"
            />

            <input
              type="text"
              name="address.street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
            />

            <input
              type="text"
              name="address.city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
            />

            <input
              type="text"
              name="address.state"
              placeholder="State"
              value={formData.address.state}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
            />

            <input
              type="text"
              name="address.zipCode"
              placeholder="Zip Code"
              value={formData.address.zipCode}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
            />

            <input
              type="text"
              name="address.country"
              placeholder="Country"
              value={formData.address.country}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
            />

            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required={isShowingShelterFields}
              rows={3}
            />
          </>
        )}

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
