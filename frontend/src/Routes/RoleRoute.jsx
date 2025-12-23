import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth.jsx";

const RoleRoute = ({ allowedRoles }) => {
  const { isAuthenticated, auth } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/astrivion-login" />;
  }

  const userRole = auth?.user?.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to= "*" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
