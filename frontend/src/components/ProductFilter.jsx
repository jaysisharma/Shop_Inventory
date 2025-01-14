import { useState } from 'react';

const ProductFilter = ({ filter, setFilter }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false); // State to toggle filter visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
      {/* Filter button */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)} // Toggle visibility
        className="w-full py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter section (visible when isFilterVisible is true) */}
      {isFilterVisible && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Filter Products</h2>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search by name"
              name="name"
              value={filter.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Search by category"
              name="category"
              value={filter.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Min Price"
                name="minPrice"
                value={filter.minPrice}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                name="maxPrice"
                value={filter.maxPrice}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={() => setFilter({})}
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
