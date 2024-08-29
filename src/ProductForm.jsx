import React, { useState, useEffect } from "react";
import axios from "axios";
import './productform.css';

const ProductForm = () => {
  const [Submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });

  useEffect(() => {
    const lastId = localStorage.getItem("lastId");
    if (lastId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id: parseInt(lastId) + 1,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id: 0,
      }));
    }
  }, []);           

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
      category: formData.category,
      image: imageUrl,
    };
    // console.log(formData.Category);
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
      setSubmitted(true); 
      localStorage.setItem("lastId", formData.id);
      setFormData({
        id: formData.id + 1, 
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (Submitted) {
    return <p>Form submitted successfully!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
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
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" name="image" onChange={handleChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
