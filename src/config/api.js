import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuthSession,
} from "../utils/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL });

// Auto attach access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Bare axios call (bypasses the interceptors above) so refreshing the
// access token never recurses into the 401 handler below.
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await axios.post(`${baseURL}/api/identity/refresh`, {
    refreshToken,
  });

  return data.data;
};

// Queue of requests waiting on an in-flight refresh, so concurrent 401s
// trigger a single /refresh call instead of one each.
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    const isAuthEndpoint = originalRequest?.url?.includes("/api/identity/refresh") ||
      originalRequest?.url?.includes("/api/identity/login");

    if (response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await refreshAccessToken();
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      flushQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      clearAuthSession();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
