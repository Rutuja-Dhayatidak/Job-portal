import React from 'react';
import { Navigate } from 'react-router-dom';

const TrustProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const allowedRoles = ["Trust & Safety", "superAdmin", "SUPER_ADMIN", "trust_safety"];

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default TrustProtectedRoute;
