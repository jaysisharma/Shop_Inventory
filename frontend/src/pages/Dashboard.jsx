import React, { useState, useEffect } from 'react';
import ActivityFeed from '../components/ActivityFeed';
import { useNavigate } from 'react-router-dom'; // Use useNavigate hook

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const navigate = useNavigate(); // Hook for navigation

  // Simulate fetching data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Replace with actual API calls to fetch data
      setRevenue(50000);  // Example total revenue
      setTotalProducts(320);  // Example total products sold
      setTotalSales(450);  // Example total sales transactions
    };

    fetchDashboardData();
  }, []);

  // Handle navigation for creating a repair order
  const handleCreateRepairOrder = () => {
    navigate('/repair-orders/create'); // Navigate to create repair order page
  };

  // Handle navigation for viewing repair orders
  const handleViewRepairOrders = () => {
    navigate('/repair-orders'); // Navigate to view repair orders page
  };

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
          <p className="text-3xl font-bold text-green-600">${revenue}</p>
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
      <div className="absolute bottom-6 right-6 flex flex-col sm:flex-row gap-4">
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
