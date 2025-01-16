import React, { useState, useEffect } from 'react';
import ActivityFeed from '../components/ActivityFeed';
import { useNavigate } from 'react-router-dom';
import { fetchYearReport } from '../services/api'; // Import the fetchYearReport function

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch year report data
        const yearReport = await fetchYearReport();

        // Update state with fetched data
        setRevenue(yearReport.totalRevenue);
        setTotalProducts(yearReport.totalItemsSold); // Assuming items sold comes from yearReport
        setTotalSales(yearReport.totalItemsSold); // Adjust if needed
      } catch (err) {
        setError(err.message); // Capture any errors
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchDashboardData();
  }, []);

  // Handle navigation
  const handleCreateRepairOrder = () => navigate('/repair-orders/create');
  const handleViewRepairOrders = () => navigate('/repair-orders');

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading dashboard data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
        <p className="text-lg text-gray-600">Here's a quick overview of your business performance.</p>
      </header>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">Rs {revenue}</p>
        </div>

        {/* Total Products */}
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Products Sold</h2>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
        </div>

        {/* Total Sales */}
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Sales Transactions</h2>
          <p className="text-3xl font-bold text-yellow-600">{totalSales}</p>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCreateRepairOrder}
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition"
        >
          Create Repair Order
        </button>
        <button
          onClick={handleViewRepairOrders}
          className="px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-500 transition"
        >
          View Repair Orders
        </button>
      </div>

      {/* Notifications / Updates */}
      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  );
};

export default Dashboard;
