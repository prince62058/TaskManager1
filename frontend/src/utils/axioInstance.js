import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout for mobile networks
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear any stored user data
      localStorage.removeItem("persist:root")
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
