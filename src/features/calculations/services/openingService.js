import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

// Call API to perform opening calculation
export const calculateOpening = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Z: 100,
        resultBendingMoment: 200,
        status: "OK",
      });
    }, 500);
  });
};
