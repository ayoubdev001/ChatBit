import axios from "axios";
import { getToken } from "../asyncstorg/storage";

// API URL from environment variable,
// or use the local backend address as a fallback.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.108:3000/api";

// Create the Axios API client.
const api = axios.create({
  baseURL: API_URL,

  // Tell the server that we're sending JSON.
  headers: {
    "Content-Type": "application/json",
  },

  // Stop waiting after 10 seconds.
  timeout: 10000,
});

// Automatically attach the JWT to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    // if a token is stored on the device.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API/network errors globally.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response) {
      // The server responded with an error.
      console.log(
        "API Error:",
        error.response.status,
        error.response.data
      );

      if (error.response.status === 401) {
        // Token is invalid or expired.
        // Logout handling can be added here later.
      }
    } else if (error.request) {
      // The request was sent but the server did not respond.
      console.log("Network Error: Server unreachable");
    } else {
      // Something went wrong while creating the request.
      console.log("Request Error:", error.message);
    }

    // Pass the error back to the code that made the request.
    return Promise.reject(error);
  }
);

// Authentication API functions.
export const login = (data) => api.post("/auth/login", data);

export const register = (data) => api.post("/auth/register", data);

export default api;