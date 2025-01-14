// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // Change if your backend URL is different

// API for Repair Services
export const getRepairServices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/repair-services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching repair services", error);
    throw error;
  }
};

export const createRepairService = async (repairService) => {
  try {
    const response = await axios.post(`${BASE_URL}/repair-services`, repairService);
    return response.data;
  } catch (error) {
    console.error("Error creating repair service", error);
    throw error;
  }
};

// Report API
export const getRepairServiceReport = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/report`);
    return response.data;
  } catch (error) {
    console.error("Error fetching repair service report", error);
    throw error;
  }
};
