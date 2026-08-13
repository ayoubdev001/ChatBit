import axios from "axios";
import { getToken } from "../lib/storage";

const API_URL = "http://192.168.1.244:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "➡️ REQUEST:",
    config.method?.toUpperCase(),
    `${config.baseURL}${config.url}`
  );

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ RESPONSE:",
      response.status,
      response.config.url
    );

    return response;
  },
  (error) => {
    console.log("❌ API ERROR");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else if (error.request) {
      console.log("❌ SERVER UNREACHABLE");
    } else {
      console.log("❌ ERROR:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;