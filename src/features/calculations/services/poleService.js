import axios from "axios";

import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";

// Call API to perform pole calculation
export const calculatePole = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.POLE}`,
      payload,
      { timeout: 10000 },
    );

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error);

    // Server error
    if (error.response) {
      throw {
        message: error.response.data?.message || "Server Error",
        status: error.response.status,
      };
    }

    // No response
    if (error.request) {
      throw {
        message: "No response from server",
      };
    }

    // Unexpected error
    throw {
      message: error.message,
    };
  }
};
