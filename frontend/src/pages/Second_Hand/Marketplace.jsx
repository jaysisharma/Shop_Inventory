import React, { useState, useEffect } from "react";
import axios from "axios";

const SecondHandProductMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 6;

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/second-hand-products`, {
          params: {
            page,
            limit: productsPerPage,
            search: searchQuery,
          },
        }
      );
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchQuery]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when a new search is performed
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Second-Hand Product Marketplace
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full sm:w-1/3 mx-auto p-2 rounded-lg border border-gray-300"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <img
                  src={product.images[0] || "placeholder.jpg"}
                  alt={product.name}
                  className="h-48 w-full object-cover mb-4"
                />
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-800 font-bold mt-2">${product.price}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Condition: {product.condition}
                </p>
                {product.usageDuration && (
                  <p className="text-gray-500 text-sm">
                    Used for: {product.usageDuration}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded-l-lg disabled:bg-gray-400"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200 text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-600 text-white rounded-r-lg disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondHandProductMarketplace;
