// src/components/ProductForm.js
import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", formData.image);
    data.append("upload_preset", "dheeraj");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhawap1lt/image/upload",
        data
      );
      console.log("Cloudinary response:", response.data);

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await handleImageUpload();

    if (!imageUrl) {
      console.error("Image upload failed. Aborting form submission.");
      return;
    }

    const productData = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image: imageUrl,
    };

    try {
      const response = await fetch("https://api-backend-l9q5.onrender.com/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      console.log("Form submitted:", result);

      // Clear the form fields
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        image: null,
      });
      setSubmitted(true); // Change button text

      // Reset the submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="id">ID:</label>
        <input
          type="text"
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" name="image" onChange={handleChange} />
      </div>
      <button type="submit">
        {submitted ? "Submitted!" : "Submit"}
      </button>
    </form>
  );
};

export default ProductForm;

