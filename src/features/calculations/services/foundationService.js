import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

// Call API to perform foundation calculation
export const calculateFoundation = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bearingCapacity: 300,
        overturningMoment: 150,
        status: "OK",
      });
    }, 500);
  });
};
