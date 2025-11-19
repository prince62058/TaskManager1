import React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser } = useSelector((state) => state.user)

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // If user role is not in allowed roles, redirect based on their role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/user/dashboard" replace />
    }
  }

  return <Outlet />
}

export default PrivateRoute
