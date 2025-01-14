import React, { useEffect, useState } from "react";

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [yearReport, setYearReport] = useState(null);
  const [repairRevenue, setRepairRevenue] = useState(null); // For repair services revenue
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);

  // Fetch the sales report for the current month
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/products/sales/report"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sales report");
        }
        const data = await response.json();
        setReport(data); // Set the report data once fetched
      } catch (err) {
        setError(err.message); // Set any errors encountered
      } finally {
        setLoading(false); // Stop loading after fetching or error
      }
    };
    fetchReport(); // Call the function to fetch the report data
  }, []);

  // Fetch the sales report for the current year
  useEffect(() => {
    const fetchYearReport = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/products/sales/year-report"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch current year sales report");
        }
        const data = await response.json();
        setYearReport(data); // Set the year report data once fetched
      } catch (err) {
        setError(err.message); // Set any errors encountered
      }
    };
    fetchYearReport(); // Call the function to fetch the yearly report data
  }, []);

  // Fetch the repair services revenue
  useEffect(() => {
    const fetchRepairRevenue = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/repair-services/total-revenue"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repair services revenue");
        }
        const data = await response.json();
        setRepairRevenue(data); // Set the repair revenue once fetched
      } catch (err) {
        setError(err.message); // Set any errors encountered
      }
    };
    fetchRepairRevenue(); // Call the function to fetch the repair revenue
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-gray-500">
            Loading sales report...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  // If data is loaded, render the sales report
  return (
    <>
      <div className="p-8">
        {repairRevenue && (
          <fieldset className="border-2 h-auto w-full border-gray-300 p-6 rounded-lg mb-8">
            <legend className="text-2xl font-semibold text-gray-800 mb-4">
              Total Revenue
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Revenue Card */}
              <div className="bg-white shadow-xl rounded-lg p-6 text-center cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Total Revenue
                </h2>
                <p className="text-2xl font-bold text-green-600">
                  ${repairRevenue.totalRevenue}
                </p>
              </div>

              {/* From Sales Card */}
              <div
                className="bg-white shadow-xl rounded-lg p-6 text-center cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out"
                onClick={() => setIsModalOpen(true)}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Total Revenue (This Month)
                </h2>
                <p className="text-3xl font-semibold text-green-600">
                  ${report.totalRevenue}
                </p>
                <p className="mt-2 text-gray-600">
                  From Sales, Products & Services
                </p>
              </div>

              {/* Current Year Total Revenue Card */}
              <div
                className="bg-white shadow-xl rounded-lg p-6 text-center cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out"
                onClick={() => setIsYearModalOpen(true)}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Total Revenue (This Year) From Sales
                </h2>
                <p className="text-3xl font-semibold text-green-600">
                  ${yearReport?.totalRevenue || "Loading..."}
                </p>
              </div>

              {/* From Second-Hand Products Card */}
              <div className="bg-white shadow-xl rounded-lg p-6 text-center cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  From Second-Hand Products
                </h2>
                <p className="text-2xl font-bold text-green-600">
                  ${repairRevenue.totalRevenueFromSecondHandProducts}
                </p>
              </div>

              {/* From Repair Services Card */}
              <div className="bg-white shadow-xl rounded-lg p-6 text-center cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  From Repair Services
                </h2>
                <p className="text-2xl font-bold text-green-600">
                  ${repairRevenue.totalRevenueFromRepairServices}
                </p>
              </div>
            </div>
          </fieldset>
        )}
      </div>

      <div className="p-8 bg-gray-50 min-h-screen flex justify-between gap-4">
        {/* Modal for current month's sales report */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-11/12 max-w-4xl rounded-lg p-6 relative shadow-xl">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Sales Report (This Month)
              </h1>

              {/* Sales Report in Fieldset */}
              <fieldset className="border-2 border-gray-300 p-6 rounded-lg mb-6">
                <legend className="text-2xl font-semibold text-gray-800">
                  Summary 
                </legend>
                <div className="mb-4 space-y-2">
                  <p className="text-lg text-gray-600">
                    <strong>Total Revenue:</strong>{" "}
                    <span className="text-green-600">
                      ${report.totalRevenue}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    <strong>Total Items Sold:</strong>{" "}
                    <span className="text-green-600">
                      {report.totalItemsSold}
                    </span>
                  </p>
                </div>
              </fieldset>

              {/* Product Summary Table */}
              <fieldset className="border-2 border-gray-300 p-6 rounded-lg">
                <legend className="text-2xl font-semibold text-gray-800">
                  Product Summary
                </legend>
                <table className="w-full table-auto border-collapse border border-gray-200 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                        Product Name
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                        Quantity Sold
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                        Revenue Generated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.productSummary.map((product, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-gray-200 px-4 py-2">
                          {product.name}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {product.quantitySold}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          ${product.revenueGenerated.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </fieldset>
            </div>
          </div>
        )}

        {/* Modal for current year's sales report */}
        {isYearModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-11/12 max-w-4xl rounded-lg p-6 relative shadow-xl">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsYearModalOpen(false)}
              >
                ✖
              </button>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Sales Report (This Year)
              </h1>

              {/* Sales Report in Fieldset for the Year */}
              <fieldset className="border-2 border-gray-300 p-6 rounded-lg mb-6">
                <legend className="text-2xl font-semibold text-gray-800">
                  Summary
                </legend>
                <div className="mb-4 space-y-2">
                  <p className="text-lg text-gray-600">
                    <strong>Total Revenue:</strong>{" "}
                    <span className="text-green-600">
                      ${yearReport?.totalRevenue || 0}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    <strong>Total Items Sold:</strong>{" "}
                    <span className="text-green-600">
                      {yearReport?.totalItemsSold || 0}
                    </span>
                  </p>
                </div>
              </fieldset>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesReport;
