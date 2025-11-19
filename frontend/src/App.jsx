import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import Dashboard from "./pages/admin/Dashboard"
import ManageTasks from "./pages/admin/ManageTasks"
import ManageUsers from "./pages/admin/ManageUsers"
import CreateTask from "./pages/admin/CreateTask"
import PrivateRoute from "./routes/PrivateRoute"
import UserDashboard from "./pages/user/UserDashboard"
import TaskDetails from "./pages/user/TaskDetails"
import MyTasks from "./pages/user/MyTasks"
import { useSelector, useDispatch } from "react-redux"
import { signInSuccess, signOutSuccess } from "./redux/slice/userSlice"
import axiosInstance from "./utils/axioInstance"

import toast, { Toaster } from "react-hot-toast"

// Component to handle auth logout events (must be inside BrowserRouter)
const AuthHandler = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthLogout = (event) => {
      console.log("[App] Auth logout event received")
      dispatch(signOutSuccess())
      localStorage.removeItem("persist:root")
      // Use React Router navigate instead of window.location to prevent reload
      navigate("/login", { replace: true })
    }

    window.addEventListener("auth:logout", handleAuthLogout)

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout)
    }
  }, [dispatch, navigate])

  return null
}

const App = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [isVerifying, setIsVerifying] = useState(true)

  // Verify user authentication on app load/reload (but skip if just logged in or navigating)
  useEffect(() => {
    let isMounted = true
    let verificationTimeout
    let hasVerified = false

    const verifyUser = async () => {
      // Skip if already verified in this session
      if (hasVerified) {
        if (isMounted) {
          setIsVerifying(false)
        }
        return
      }

      // Skip verification if user just logged in (to prevent reload loop)
      const justLoggedIn = sessionStorage.getItem("justLoggedIn")
      if (justLoggedIn === "true") {
        console.log("[Auth] Skipping verification - just logged in")
        hasVerified = true
        if (isMounted) {
          setIsVerifying(false)
        }
        return
      }

      // Only verify if we have a persisted user but want to check if cookie is still valid
      if (currentUser) {
        // Add a small delay to ensure cookies are set
        verificationTimeout = setTimeout(async () => {
          try {
            console.log("[Auth] Verifying user session...")
            const response = await axiosInstance.get("/auth/user-profile")
            // Update user data if needed
            if (response.data && isMounted) {
              console.log("[Auth] Session verified successfully")
              dispatch(signInSuccess(response.data))
            }
            hasVerified = true
          } catch (error) {
            // If verification fails, clear user state
            if (error.response?.status === 401 && isMounted) {
              // Session expired or invalid
              console.log("[Auth] Session expired or invalid")
              dispatch(signOutSuccess())
              // Clear persisted state
              localStorage.removeItem("persist:root")
              // Don't redirect here, let PrivateRoute handle it
            } else if (error.response?.status === 404 && isMounted) {
              // API route not found - might be configuration issue
              console.error("[Auth] API route not found. Check VITE_API_URL configuration.")
              console.error("Requested URL:", error.config?.url)
              console.error("Base URL:", error.config?.baseURL)
            } else {
              console.error("[Auth] Verification error:", error.message)
            }
            hasVerified = true
          } finally {
            // Always set verifying to false after check
            if (isMounted) {
              setIsVerifying(false)
            }
          }
        }, 300) // Small delay to ensure cookie is set
      } else {
        // No user, no need to verify
        hasVerified = true
        if (isMounted) {
          setIsVerifying(false)
        }
      }
    }

    // Only verify on initial mount, not on route changes
    verifyUser()

    return () => {
      isMounted = false
      if (verificationTimeout) {
        clearTimeout(verificationTimeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount to verify persisted user

  // Show loading while verifying
  if (isVerifying && currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <BrowserRouter>
        <AuthHandler />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/create-task" element={<CreateTask />} />
            <Route path="/user/task-details/:id" element={<TaskDetails />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Root />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </div>
  )
}

const NotFound = () => {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to appropriate page if logged in, otherwise to login
    if (currentUser) {
      const timer = setTimeout(() => {
        if (currentUser.role === "admin") {
          navigate("/admin/dashboard", { replace: true })
        } else {
          navigate("/user/dashboard", { replace: true })
        }
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentUser, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page Not Found</p>
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  )
}

export default App

const Root = () => {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser) {
    return <Navigate to={"/login"} replace />
  }

  return currentUser.role === "admin" ? (
    <Navigate to={"/admin/dashboard"} replace />
  ) : (
    <Navigate to={"/user/dashboard"} replace />
  )
}
