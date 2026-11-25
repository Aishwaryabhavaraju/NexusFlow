import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nexusflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401s
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        localStorage.removeItem("nexusflow_token");
        localStorage.removeItem("nexusflow_user");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
