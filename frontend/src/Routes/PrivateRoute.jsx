import React from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, auth } = useAuth();
  const params = useParams();
  const location = useLocation();


  if (!isAuthenticated) return <Navigate to="/login" />;


  const allParamValues = params ? Object.values(params) : [];
  const extractedId = allParamValues
    .flatMap((v) => (typeof v === "string" ? v.split("/") : []))
    .find((p) => /^[a-fA-F0-9]{24}$/.test(p));

  const shouldCheckUserId =
    location?.pathname?.includes("/employee/") ||
    location?.pathname?.includes("/single-attendance") ||
    location?.pathname?.includes("/employee/profile") ||
    location?.pathname?.includes("/employee/slip") ||
    location?.pathname?.includes("/employee/attendance");

  if (
    extractedId &&
    shouldCheckUserId &&
    auth?.user?._id &&
    auth.user._id !== extractedId
  ) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default PrivateRoute;
