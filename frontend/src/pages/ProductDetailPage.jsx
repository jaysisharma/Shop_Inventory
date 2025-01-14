import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for image modal
  const [isSellModalOpen, setIsSellModalOpen] = useState(false); // State for sell modal
  const [sellPrice, setSellPrice] = useState(''); // State for the selling price
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setProduct(response.data.product);
      } catch (error) {
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="text-center text-xl font-semibold text-gray-700">Loading product details...</p>;
  if (error) return <p className="text-center text-xl text-red-500 font-semibold">{error}</p>;

  const handleSell = async () => {
    if (!sellPrice || isNaN(sellPrice) || Number(sellPrice) <= 0) {
      alert('Please enter a valid selling price.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/api/products/${productId}/sell`, {
        sellPrice: Number(sellPrice),
      });

      alert(response.data.message); // Display success message
      setProduct({ ...product, quantity: product.quantity - 1 }); // Update quantity locally
      setSellPrice(''); // Reset the selling price input
      setIsSellModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error selling product:', error);
      alert('Failed to sell product. Please try again.');
    }
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setSellPrice(''); // Reset the selling price input
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-2xl text-blue-600 hover:text-black hover:bg-transparent font-semibold mb-6 mt-4 ml-6 inline-flex items-center"
      >
        &larr; Back
      </button>

      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6 lg:p-12 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-12">

          {/* Product Image Gallery */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative group max-w-md w-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
                onClick={() => setIsModalOpen(true)} // Handle image click
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out rounded-lg">
                <p className="text-center text-white font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  Click to zoom
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{product.name}</h1>

            {/* Price */}
            <p className="text-3xl font-bold text-blue-600 mb-4">
              NPR <span className="text-2xl">{product.price}</span>
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-md text-gray-700 mb-4">{product.description}</p>
            )}

            {/* Product Brand */}
            {product.brand && (
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Brand:</span> {product.brand}
              </p>
            )}

            {/* Product Category */}
            {product.category && (
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">Category:</span> {product.category}
              </p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Features:</h3>
                <ul className="list-inside list-disc pl-5 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-lg">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Available */}
            <p className="text-lg text-gray-600">
              <span className="font-semibold text-gray-800">Quantity Available:</span> {product.quantity}
            </p>

            {/* Sell Button */}
            <button
              onClick={() => setIsSellModalOpen(true)} // Open modal for selling
              disabled={product.quantity <= 0} // Disable button if quantity is zero
              className={`w-full lg:w-auto py-3 px-8 rounded-md shadow-lg transition-all duration-300 ease-in-out ${
                product.quantity > 0
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                  : 'bg-gray-400 text-gray-800 cursor-not-allowed'
              }`}
            >
              {product.quantity > 0 ? 'Sell Product' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Selling */}
      {isSellModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Selling Price</h2>
            <input
              type="number"
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Selling Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeSellModal}
                className="py-2 px-6 bg-gray-300 rounded-lg text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSell}
                className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Zoomed Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-3xl max-h-3xl object-contain"
            />
            <button
              className="absolute top-2 right-2 text-white text-3xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage; 