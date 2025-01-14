import React from "react";

const Pagination = ({ currentPage, totalPages, setPage }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          currentPage <= 1 ? "bg-gray-400 cursor-not-allowed" : ""
        }`}
      >
        Previous
      </button>

      {/* Page Number Display */}
      <span className="text-lg font-semibold text-gray-700">
        {currentPage} / {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => setPage(parseInt(currentPage, 10) + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          currentPage >= totalPages ? "bg-gray-400 cursor-not-allowed" : ""
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
