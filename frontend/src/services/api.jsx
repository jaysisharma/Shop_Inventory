// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // Change if your backend URL is different


// src/api.js

// Fetch the sales report for the current month
export const fetchSalesReport = async () => {
  try {
    const response = await fetch(
      "https://shop-inventory-rorw.onrender.com/api/products/sales/report"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch sales report");
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

// Fetch the sales report for the current year
export const fetchYearReport = async () => {
  try {
    const response = await fetch(
      "https://shop-inventory-rorw.onrender.com/api/products/sales/year-report"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch current year sales report");
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchMonthlyReport = async () => {
  try {
    const response = await fetch(
      "https://shop-inventory-rorw.onrender.com/api/products/sales/report"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch current year sales report");
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};




// Fetch the repair services revenue
export const fetchRepairRevenue = async () => {
  try {
    const response = await fetch(
      "https://shop-inventory-rorw.onrender.com/api/repair-services/total-revenue"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch repair services revenue");
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};


export const fetchActivities = async () => {
  try {
    const response = await axios.get("https://shop-inventory-rorw.onrender.com/api/activities");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching activities: " + error.message);
  }
};

// Fetch total repairs completed this month
export const fetchTotalRepairsThisMonth = async () => {
  try {
    const response = await fetch(
      "https://shop-inventory-rorw.onrender.com/api/repair-services/total-repairs-count-this-month"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch total repairs this month");
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};
