import { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/stats');
        const fetchedStats = [
          { title: 'Total Products', value: response.data.totalProducts },
          { title: 'Total Sales (Monthly)', value: `NPR ${response.data.totalSales.toLocaleString()}` },
          { title: 'Total Repair Requests', value: response.data.totalRepairRequests },
          { title: 'Active Marketplace Listings', value: response.data.activeListings },
        ];

        setStats(fetchedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className=" mx-auto p-6 bg-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white text-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
          >
            <h2 className="text-xl font-semibold text-gray-700">{stat.title}</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
