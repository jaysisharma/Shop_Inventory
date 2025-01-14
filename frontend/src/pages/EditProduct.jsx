import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '', // For image URL
    brand: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null); // New image to upload
  const [imageDeleted, setImageDeleted] = useState(false); // Flag to track if image is deleted

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'image') {
      setNewImage(e.target.files[0]); // Save the new image file
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'products');
    formData.append('cloud_name', 'dfzbgojju');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfzbgojju/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl = product.image; 

    if (newImage) {
      try {
        imageUrl = await uploadImageToCloudinary(newImage);
      } catch (error) {
        setError('Failed to upload image');
        setLoading(false);
        return;
      }
    }

    const updatedProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      image: imageDeleted ? '' : imageUrl, 
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/api/products/${productId}`,
        updatedProduct
      );
      alert('Product Updated Successfully');
      navigate('/manage-products');
    } catch (error) {
      console.error(error);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImageDeleted(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!product.name) return <p>Loading product details...</p>;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name || ''}
              onChange={handleChange}
              className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description || ''}
              onChange={handleChange}
              className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          {/* Product Image */}
          <div>
            <label htmlFor="image" className="block text-lg font-semibold text-gray-700">Product Image</label>
            <div className="flex items-center space-x-4 mt-2">
              {product.images && !imageDeleted && (
                <div>
                  <img
                    src={product.images[0]}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-md shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete Image
                  </button>
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
          </div>

          {/* Price and stock */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="price" className="block text-lg font-semibold text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price || ''}
                onChange={handleChange}
                className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="stock" className="block text-lg font-semibold text-gray-700">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={product.stock || ''}
                onChange={handleChange}
                className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Category and Brand */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="category" className="block text-lg font-semibold text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category || ''}
                onChange={handleChange}
                className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="brand" className="block text-lg font-semibold text-gray-700">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={product.brand || ''}
                onChange={handleChange}
                className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
