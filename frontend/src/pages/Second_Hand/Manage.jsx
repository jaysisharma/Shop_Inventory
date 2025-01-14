import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing the icons

const SecondHandManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/second-hand-products');
        setProducts(response.data.data); // Assuming 'data' contains the products
      } catch (error) {
        setError('Failed to fetch second-hand products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate('/add-second-hand-product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-second-hand-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/second-hand-products/${productId}`);
      setProducts(products.filter(product => product._id !== productId)); // Remove deleted product from the list
    } catch (error) {
      setError('Failed to delete second-hand product. Please try again later.');
    }
  };

  if (loading) return <p>Loading second-hand products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Manage Second-Hand Products</h1>

        {/* Add Product Button */}
        <button
          onClick={handleAddProduct}
          className="mb-6 py-3 px-6 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700"
        >
          Add New Second-Hand Product
        </button>

        {/* Product List */}
        <div className="space-y-6">
          {products.length === 0 ? (
            <p>No second-hand products found.</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Condition</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    {/* Product Image */}
                    <td className="px-4 py-2">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-md border p-2"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">NPR {product.price}</td>
                    <td className="px-4 py-2">{product.condition}</td>
                    <td className="px-4 py-2 flex space-x-4 items-center h-32">
                      {/* Edit Icon */}
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={20} />
                      </button>

                      {/* Delete Icon */}
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt size={20} />
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
  );
};

export default SecondHandManageProduct;
