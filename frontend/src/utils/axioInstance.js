import axios from "axios"

// Better API URL detection for mobile and different environments
const getBaseURL = () => {
  // Check if VITE_API_URL is set in environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // For mobile/local development, try to detect the correct URL
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    
    // If running on localhost or 127.0.0.1, use local backend
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3000/api"
    }
    
    // For mobile devices on same network, you might need to use your computer's IP
    // This is a fallback - ideally set VITE_API_URL in your .env file
  }

  // Default fallback
  return "http://localhost:3000/api"
}

const BASE_URL = getBaseURL()

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout for mobile networks
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request for debugging
    const fullUrl = `${config.baseURL}${config.url}`
    console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`)
    return config
  },
  (error) => {
    console.error("[API Request Error]", error)
    return Promise.reject(error)
  }
)

// Track if we're already redirecting to prevent multiple redirects
let isRedirecting = false

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Better error handling for mobile
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      // Handle 401 Unauthorized errors - use event instead of window.location to prevent reload
      if (status === 401) {
        // Prevent multiple redirects
        if (!isRedirecting && window.location.pathname !== "/login") {
          isRedirecting = true
          // Clear any stored user data
          localStorage.removeItem("persist:root")
          // Dispatch custom event for navigation without reload
          const event = new CustomEvent("auth:logout", { detail: { reason: "unauthorized" } })
          window.dispatchEvent(event)
          // Reset redirect flag after a delay
          setTimeout(() => {
            isRedirecting = false
          }, 1000)
        }
      }
      
      // Handle 404 Not Found errors
      if (status === 404) {
        console.error(`[API Error] 404 Not Found: ${error.config?.url}`)
        // Don't redirect on 404, let the component handle it
      }

      // Log error for debugging
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${status}: ${message}`, error.response)
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error("[API Error] Network error - no response received", error.request)
      
      // For mobile, this might be a connectivity issue
      if (typeof window !== "undefined" && !navigator.onLine) {
        console.error("[API Error] Device is offline")
      }
    } else {
      // Something else happened
      console.error("[API Error] Request setup error", error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
