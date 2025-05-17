import { useState } from "react";
import toast from "react-hot-toast";
import { createPet } from "../services/api";
import { useNavigate } from "react-router-dom";

function AddPetPage() {
  const navigate = useNavigate();
  const loggedInShelterId = "YOUR_SHELTER_ID";

  const [formData, setFormData] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: { value: "", unit: "years" },
    size: "Medium",
    gender: "Unknown",
    color: "",
    description: "",
    location: { country: "", state: "", city: "" },
    photos: [],
    shelter: loggedInShelterId,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      if (file) setPreview(URL.createObjectURL(file));
      else setPreview(null);
    } else if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]: value,
        },
      }));
    } else if (name.startsWith("age.")) {
      const ageField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        age: {
          ...prev.age,
          [ageField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("species", formData.species);
    payload.append("breed", formData.breed);
    payload.append("description", formData.description);
    payload.append("location[country]", formData.location.country);
    payload.append("location[state]", formData.location.state);
    payload.append("location[city]", formData.location.city);
    payload.append("color", formData.color);
    payload.append("gender", formData.gender);
    payload.append("size", formData.size);
    payload.append("age.value", formData.age.value);
    payload.append("age.unit", formData.age.unit);
    payload.append("shelter", formData.shelter);

    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      await createPet(payload);
      toast.success("Pet added successfully!");
      setFormData({
        name: "",
        species: "Dog",
        breed: "",
        age: { value: "", unit: "years" },
        size: "Medium",
        gender: "Unknown",
        color: "",
        description: "",
        location: { country: "", state: "", city: "" },
        photos: [],
        shelter: loggedInShelterId,
        image: null,
      });
      setPreview(null);
      navigate("/shelter-dashboard", {
        state: { refresh: true, shelterId: loggedInShelterId },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add pet");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Pet</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          placeholder="Pet Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <select
          name="species"
          value={formData.species}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        >
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Small & Furry">Small & Furry</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="breed"
          placeholder="Breed"
          value={formData.breed}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <div className="flex space-x-2">
          <input
            type="number"
            name="age.value"
            placeholder="Age"
            value={formData.age.value}
            onChange={handleChange}
            required
            className="input flex-grow p-2 border rounded"
          />
          <select
            name="age.unit"
            value={formData.age.unit}
            onChange={handleChange}
            className="input p-2 border rounded"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        >
          <option value="">Select Size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="Extra Large">Extra Large</option>
        </select>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Unknown">Unknown</option>
        </select>

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <input
          type="text"
          name="location.country"
          placeholder="Country"
          value={formData.location.country}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <input
          type="text"
          name="location.state"
          placeholder="State"
          value={formData.location.state}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <input
          type="text"
          name="location.city"
          placeholder="City"
          value={formData.location.city}
          onChange={handleChange}
          required
          className="input w-full p-2 border rounded"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="input w-full p-2 border rounded"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

        <button
          type="submit"
          className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Pet
        </button>
      </form>
    </div>
  );
}

export default AddPetPage;
