import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Default image in case the product doesn't have one
  const productImage =
    product.image || "https://via.placeholder.com/300x300?text=No+Image";

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out w-full max-w-sm mx-auto">
      {/* Product Image with rounded top corners */}
      <div
        className="relative w-full h-64 bg-cover bg-center rounded-t-xl"
        style={{ backgroundImage: `url(${productImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', }}
      >
        {/* Optional Overlay to enhance image readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-30"></div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <h3 className="text-2xl font-bold text-gray-800 truncate">{product.name}</h3>

        {/* Category */}
        <p className="text-md text-gray-500 font-medium">{product.category}</p>

        {/* Price and Stock Status */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-blue-600">NPR {product.price}</p>
          {/* Stock Indicator with color coding */}
          {product.quantity > 0 ? (
            <span className="text-sm text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {/* Product Quantity */}
        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>

        {/* View Details Button with hover effect */}
        <button
          onClick={handleViewDetails}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transform transition-all duration-200 ease-in-out"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
