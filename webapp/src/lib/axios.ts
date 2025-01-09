import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attach token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Check if the error is a 401 Unauthorized error
    if (
      error.response?.status === 401 &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register")
    ) {
      // Redirect to the login page
      if (typeof window !== "undefined") {
        localStorage.removeItem("token"); // Clear the token from localStorage
        window.location.href = "/login"; // Redirect to the login page
      }
    } else if (error.response?.status === 429) {
      alert("Credits exceeded. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
