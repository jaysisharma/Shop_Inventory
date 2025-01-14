import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateRepairOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    contactNumber: "",
    totalItems: 0,
    products: [],
    expectedDeliveryDate: "",
    receiverName: "", // Added receiver name
    expectationAmount: "",
  });

  useEffect(() => {
    const fetchRepairOrder = async () => {
      try {
        const response = await axios.get(
          `https://shop-inventory-rorw.onrender.com/api/repair-services/${id}`
        );
        console.log("Fetched data:", response.data.data); // Log the fetched data to ensure it's correct
        const data = response.data;
        console.log("Fetched data:", data.data.customerName); //
        // Set the form data to the fetched data
        setFormData({
          customerName: data.data.customerName || "",
          customerEmail: data.data.customerEmail || "",
          contactNumber: data.data.contactNumber || "",
          totalItems: data.data.totalItems || 0,
          products: data.products || [],
          expectedDeliveryDate: data.data.expectedDeliveryDate || "",
          receiverName: data.data.receiverName || "",
          expectationAmount: data.data.expectationAmount || "",
        });
      } catch (error) {
        console.error("Error fetching repair order:", error);
      }
    };

    fetchRepairOrder();
  }, [id]);

  // Accessories for each product type
  const accessories = {
    camera: ["Lens", "Tripod", "Memory Card", "Battery", "Charger"],
    drone: ["Extra Propellers", "Controller", "Battery", "Carrying Case"],
    led: ["Remote", "Mounting Brackets", "Power Cable", "Adapter"],
    other: ["Accessories 1", "Accessories 2", "Accessories 3"],
  };

  // State for adding extra accessories
  const [newAccessory, setNewAccessory] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalItems") {
      const totalItems = parseInt(value) || 0;
      const updatedProducts = Array.from(
        { length: totalItems },
        (_, index) => ({
          modelNo: "",
          serialNo: "",
          problem: "",
          productName: "",
          selectedAccessories: [], // To hold selected accessories
          accessoryDescriptions: {}, // To hold accessory descriptions
          images: [], // For storing images
        })
      );
      setFormData({ ...formData, totalItems, products: updatedProducts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;

    // Reset selected accessories when product type changes
    if (field === "productName") {
      updatedProducts[index].selectedAccessories = [];
      updatedProducts[index].accessoryDescriptions = {};
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  const handleAccessoryChange = (index, accessory) => {
    const updatedProducts = [...formData.products];
    const selectedAccessories = updatedProducts[index].selectedAccessories;

    if (selectedAccessories.includes(accessory)) {
      updatedProducts[index].selectedAccessories = selectedAccessories.filter(
        (item) => item !== accessory
      );
      delete updatedProducts[index].accessoryDescriptions[accessory];
    } else {
      updatedProducts[index].selectedAccessories = [
        ...selectedAccessories,
        accessory,
      ];
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  const handleDescriptionChange = (index, accessory, description) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index].accessoryDescriptions[accessory] = description;
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleNewAccessoryChange = (e) => {
    const { name, value } = e.target;
    setNewAccessory({ ...newAccessory, [name]: value });
  };

  const handleAddNewAccessory = (index) => {
    if (newAccessory.name && newAccessory.description) {
      const updatedProducts = [...formData.products];
      const newAccessoryWithDescription = {
        name: newAccessory.name,
        description: newAccessory.description,
      };

      updatedProducts[index].selectedAccessories.push(newAccessory.name);
      updatedProducts[index].accessoryDescriptions[newAccessory.name] =
        newAccessory.description;

      setFormData({ ...formData, products: updatedProducts });
      // Reset the new accessory form
      setNewAccessory({ name: "", description: "" });
    }
  };

  const handleImageChange = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formDataForCloudinary = new FormData();
        formDataForCloudinary.append("file", file); // Append the selected file
        formDataForCloudinary.append("upload_preset", "products"); // Use your Cloudinary upload preset

        // Upload the file to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dfzbgojju/image/upload",
          formDataForCloudinary
        );

        const imageUrl = cloudinaryResponse.data.secure_url; // Get the image URL from the response

        // Update the product's image field
        const updatedProducts = [...formData.products];
        updatedProducts[index].image = imageUrl; // Save the Cloudinary URL to the product
        setFormData({ ...formData, products: updatedProducts });

        console.log("Image uploaded successfully:", imageUrl); // Log the uploaded URL
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    try {
      const formDataForCloudinary = new FormData();
      formDataForCloudinary.append("file", file); // Append the selected file
      console.log(file); // Logs the selected file

      formDataForCloudinary.append("upload_preset", "products"); // Make sure 'products' is a valid preset in Cloudinary

      // Send the file to Cloudinary
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dfzbgojju/image/upload",
        formDataForCloudinary
      );

      const imageUrl = cloudinaryResponse.data.secure_url; // Get the image URL from the response
      console.log(imageUrl); // Logs the Cloudinary image URL
    } catch (error) {
      console.log(error.message); // Logs any error messages
    }
    // Update the state with the selected file
    setFormData({ ...formData, file });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log(formData);

      const response = await axios.post(
        "https://shop-inventory-rorw.onrender.com/api/repair-services/",
        formData
      );

      setIsLoading(false);
      alert("Product added successfully!");
      navigate("/repair-orders"); // Redirect to the orders list page
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Failed To Add Product!");
      if (error.response) {
        /* empty */
      }
    }
  };

  return (
    <div className=" h-screen bg-gray-50 p-6">
      {/* Main Content */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Customer Service Form
        </h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="bg-gray-100 p-6 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">
              Customer Information
            </h3>

            {/* Customer Details */}
            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Customer's Name:
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer's name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email:
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact email"
                />
              </div>

              {/* Contact Number Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number:
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Total Items:
              </label>
              <input
                type="number"
                name="totalItems"
                value={formData.totalItems}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter total items"
              />
            </div>

            {/* Receiver Name */}
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Receiver Name:
              </label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter receiver's name"
              />
            </div>
          </div>

          {/* Dynamic Product Fields */}
          {formData.products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-md shadow-md space-y-6 mt-6"
            >
              <h4 className="text-lg font-semibold text-gray-700">
                Product {index + 1}
              </h4>

              {/* Product Type Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Type:
                </label>
                <select
                  value={product.productName}
                  onChange={(e) =>
                    handleProductChange(index, "productName", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Product</option>{" "}
                  {/* Default option */}
                  <option value="camera">Camera</option>
                  <option value="drone">Drone</option>
                  <option value="led">LED</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Model No.:
                </label>
                <input
                  type="text"
                  value={product.modelNo}
                  onChange={(e) =>
                    handleProductChange(index, "modelNo", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter model number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Serial No.:
                </label>
                <input
                  type="text"
                  value={product.serialNo}
                  onChange={(e) =>
                    handleProductChange(index, "serialNo", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter serial number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Problem:
                </label>
                <textarea
                  value={product.problem}
                  onChange={(e) =>
                    handleProductChange(index, "problem", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the problem"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images:
                </label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(index, e)}
                  accept="image/*"
                />

                {/* Display Uploaded Images */}
                {product.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {product.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Uploaded Image ${idx + 1}`}
                        className="w-full h-auto rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Accessory Selection */}
              {product.productName && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Select Accessories:
                  </h5>
                  <div className="space-y-4">
                    {accessories[product.productName]?.map((accessory) => (
                      <div
                        key={accessory}
                        className="flex items-center space-x-4"
                      >
                        <input
                          type="checkbox"
                          checked={product.selectedAccessories.includes(
                            accessory
                          )}
                          onChange={() =>
                            handleAccessoryChange(index, accessory)
                          }
                          className="h-4 w-4 text-blue-500"
                        />
                        <label className="text-sm">{accessory}</label>

                        {/* Description Input */}
                        {product.selectedAccessories.includes(accessory) && (
                          <input
                            type="text"
                            value={
                              product.accessoryDescriptions[accessory] || ""
                            }
                            onChange={(e) =>
                              handleDescriptionChange(
                                index,
                                accessory,
                                e.target.value
                              )
                            }
                            placeholder="Enter description"
                            className="ml-2 p-2 w-2/3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Extra Accessory */}
                  <div className="mt-6 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Extra Accessory:
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        name="name"
                        value={newAccessory.name}
                        onChange={handleNewAccessoryChange}
                        placeholder="Accessory Name"
                        className="p-3 w-1/2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        name="description"
                        value={newAccessory.description}
                        onChange={handleNewAccessoryChange}
                        placeholder="Description"
                        className="p-3 w-1/2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewAccessory(index)}
                        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Selected Accessories */}
              {product.selectedAccessories.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Selected Accessories:
                  </h5>
                  <ul className="list-disc pl-6">
                    {product.selectedAccessories.map((accessory) => (
                      <li key={accessory} className="text-sm">
                        {accessory}:{" "}
                        {product.accessoryDescriptions[accessory] ||
                          "No description"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Delivery Details */}
          <div className="bg-gray-100 p-6 rounded-md shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Delivery Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Date:
                </label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Expectation Amount:
              </label>
              <input
                type="text"
                name="expectationAmount"
                value={formData.expectationAmount}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter expected amount"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className={`px-6 py-3 rounded-md ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRepairOrder;
