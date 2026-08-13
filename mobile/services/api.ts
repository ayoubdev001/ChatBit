import axios from "axios";
import { getToken } from "../lib/storage";
import { API_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

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

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      console.log(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.log("Network Error: Backend unreachable");
    } else {
      console.log("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;