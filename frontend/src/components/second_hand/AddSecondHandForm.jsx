import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

const AddSecondHandProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    condition: "",
    usageDuration: "",
    conditionNotes: "",
  });
  const [images, setImages] = useState([]); // Store multiple image files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image file change (multiple images)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    if (files.length > 0) {
      setImages(files); // Store the selected files
    }
  };

  // Upload images to Cloudinary and return an array of URLs
  const uploadImagesToCloudinary = async (images) => {
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dfzbgojju/image/upload";
    const uploadPromises = images.map((image) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "products"); // Replace with your Cloudinary upload preset

      return axios.post(cloudinaryUrl, formData); // Return the promise
    });

    try {
      const responses = await Promise.all(uploadPromises); // Wait for all uploads to complete
      return responses.map((response) => response.data.secure_url); // Return an array of image URLs
    } catch (error) {
      console.error("Error uploading images to Cloudinary", error);
      throw new Error("Failed to upload images");
    }
  };

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10);

  if (images.length === 0) {
    alert("Please select at least one image.");
    setLoading(false);
    return;
  }

  try {
    // Upload images to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(images);

    // Log the image URLs to the console
    console.log("Uploaded Image URLs:", imageUrls);

    // Prepare second-hand product data including the Cloudinary image URLs
    const secondHandProductData = {
      name: formData.name,
      description: formData.description,
      price: price,
      stock: stock,
      category: formData.category,
      condition: formData.condition,
      usageDuration: formData.usageDuration,
      conditionNotes: formData.conditionNotes,
      images: imageUrls, // Store the array of image URLs
    };
    console.log(secondHandProductData)

    // Send product data to backend API
    const response = await axios.post("http://localhost:4000/api/second-hand-products", secondHandProductData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
    alert("Second-Hand Product Added Successfully");
    navigate("/manage-second-hand-products"); // Redirect to the second-hand products page
  } catch (error) {
    console.error("Error submitting second-hand product", error);
    setError("Failed to add second-hand product");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Second-Hand Product</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price and stock */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        {/* Usage Duration */}
        <div>
          <label htmlFor="usageDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Usage Duration
          </label>
          <input
            type="text"
            id="usageDuration"
            name="usageDuration"
            value={formData.usageDuration}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Condition Notes */}
        <div>
          <label htmlFor="conditionNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Condition Notes
          </label>
          <textarea
            id="conditionNotes"
            name="conditionNotes"
            value={formData.conditionNotes}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Product Images */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
            multiple // Allows multiple file selection
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>

      {/* Loading Overlay with CircularProgress */}
      {loading && (
        <div className="absolute inset-0 bg-opacity-60 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
          <CircularProgress size={60} color="inherit" />
        </div>
      )}
    </div>
  );
};

export default AddSecondHandProduct;
