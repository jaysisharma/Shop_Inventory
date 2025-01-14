import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products");
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async () => {
    try {
      if (productToDelete) {
        await axios.delete(`http://localhost:4000/api/products/${productToDelete._id}`);
        setProducts(products.filter((product) => product._id !== productToDelete._id));
        setShowModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      }
    } catch (error) {
      setError("Failed to delete product. Please try again later.");
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
            Manage Products
          </h1>

          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="mb-6 py-3 px-6 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 w-full md:w-auto"
          >
            Add New Product
          </button>

          {/* Product List */}
          <div className="overflow-x-auto">
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <table className="min-w-full table-auto border-collapse border-spacing-0">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <td className="px-4 py-2">
                        {product.images && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">NPR {product.price}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2 flex space-x-2 sm:space-x-4 items-center">
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteProduct}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 w-1/2"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-green-600 text-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Product Deleted Successfully!
            </h3>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-white text-green-600 py-2 px-4 rounded-md hover:bg-gray-200 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProduct;
