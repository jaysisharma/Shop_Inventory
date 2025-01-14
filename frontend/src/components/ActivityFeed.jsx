import { useState, useEffect } from "react";
import axios from "axios";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("https://shop-inventory-rorw.onrender.com/api/activities");
        console.log("Fetched Activities:", response.data); // Debug log

        // If response.data contains an 'activities' array, set it accordingly
        if (Array.isArray(response.data)) {
          setActivities(response.data);
        } else if (response.data.activities && Array.isArray(response.data.activities)) {
          setActivities(response.data.activities);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityColor = (type) => {
    switch (type) {
      case "create":
        return "text-green-500"; // Green for create
      case "Updated":
        return "text-yellow-500"; // Yellow for update
      case "Deleted":
        return "text-red-500"; // Red for delete
      case "sell":
        return "text-blue-500"; // Blue for sell
      default:
        return "text-gray-500"; // Default gray color
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activities</h3>

      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600">No activities available.</p>
        </div>
      ) : (
        <ul className="space-y-4 shadow-lg">
          {activities.map((activity) => (
            <li
              key={activity._id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100"
            >
              <span
                className={`text-xl font-semibold ${getActivityColor(activity.type)}`}
              >
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>

              <p className="text-gray-800">{activity.message}</p>
              <span className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;
