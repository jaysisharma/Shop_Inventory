import React, { useState, useEffect } from 'react';
import ActivityFeed from '../components/ActivityFeed';
import { useNavigate } from 'react-router-dom';
import { fetchYearReport, fetchMonthlyReport, fetchTotalRepairsThisMonth } from '../services/api';

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0); // Corrected variable name
  const [totalRepair, setTotalRepair] = useState(0); // For total repairs this month
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch year report data
        const yearReport = await fetchYearReport();
        setRevenue(yearReport.totalRevenue);
        
        // Fetch monthly report data
        const monthlyReport = await fetchMonthlyReport();
        setMonthlyRevenue(monthlyReport.totalRevenue); // Assuming totalRevenue is for the month
        
        // Fetch total repairs count for this month
        const repairCount = await fetchTotalRepairsThisMonth();
        setTotalRepair(repairCount.totalRepairs); // Assuming totalRepairs is the response field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateRepairOrder = () => navigate('/repair-orders/create');
  const handleViewRepairOrders = () => navigate('/repair-orders');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading dashboard data....</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">Rs {revenue}</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Sales This Month</h2>
          <p className="text-3xl font-bold text-blue-600">Rs {monthlyRevenue}</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Repair This Month</h2>
          <p className="text-3xl font-bold text-yellow-600">{totalRepair}</p>
        </div>
      </div>

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

      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  );
};

export default Dashboard;
