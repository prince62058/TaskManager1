import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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

const App = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [isVerifying, setIsVerifying] = useState(true)

  // Verify user authentication on app load/reload
  useEffect(() => {
    const verifyUser = async () => {
      // Only verify if we have a persisted user but want to check if cookie is still valid
      if (currentUser) {
        try {
          const response = await axiosInstance.get("/auth/user-profile")
          // Update user data if needed
          if (response.data) {
            dispatch(signInSuccess(response.data))
          }
        } catch (error) {
          // If verification fails, clear user state
          if (error.response?.status === 401) {
            dispatch(signOutSuccess())
            // Don't redirect here, let PrivateRoute handle it
          }
        }
      }
      // Always set verifying to false after check (whether user exists or not)
      setIsVerifying(false)
    }

    verifyUser()
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
        </Routes>
      </BrowserRouter>

      <Toaster />
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
