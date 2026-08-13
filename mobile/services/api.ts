import axios from "axios";
import { getToken } from "../lib/storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.100:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add JWT automatically to every protected request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.log(
        "API Error:",
        error.response.status,
        error.response.data
      );

      if (error.response.status === 401) {
        // JWT invalid/expired
        // Logout handling will be added later
      }
    } else if (error.request) {
      console.log("Network Error: Server unreachable");
    } else {
      console.log("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;