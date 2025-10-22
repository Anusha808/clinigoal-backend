// utils/api.js

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create an Axios instance with default settings
const api = axios.create({
  baseURL: process.env.API_BASE_URL || "https://clinigoal-server-side.onrender.com/api", // fallback base URL
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request interceptor – logs and attaches auth headers if needed
api.interceptors.request.use(
  async (config) => {
    // Example of dynamic token injection if using JWT
    if (process.env.AUTH_TOKEN) {
      config.headers.Authorization = `Bearer ${process.env.AUTH_TOKEN}`;
    }

    console.log(`📡 [${config.method.toUpperCase()}] ${config.url}`);

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error.message);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor – handle global responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response (${response.status}): ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `⚠️ API Error: ${error.response.status} ${error.response.config?.url}\nMessage: ${error.response.data?.message || error.message}`
      );
    } else if (error.request) {
      console.error("🚫 No response received from server:", error.message);
    } else {
      console.error("🔥 Unexpected Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
