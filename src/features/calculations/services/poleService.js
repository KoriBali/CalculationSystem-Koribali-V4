import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

// Call API to perform pole calculation
export const calculatePole = async (payload) => {
  try {
    // Send POST request to pole endpoint with timeout
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.POLE}`,
      payload,
      { timeout: 10000 },
    );

    // Return response data directly
    return response.data;
  } catch (error) {
    // Log full error for debugging purposes
    console.error("API ERROR:", error);

    // Handle server response errors (4xx / 5xx)
    if (error.response) {
      throw {
        message: error.response.data?.message || "Server Error",
        status: error.response.status,
      };
    }

    // Handle no response received (network issue / timeout)
    if (error.request) {
      throw { message: "No response from server" };
    }

    // Handle unexpected errors
    throw { message: error.message };
  }
};
