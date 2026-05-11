import React from 'react';
import { Navigate } from 'react-router-dom';

const SalesProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Support both DB names and internal codes seamlessly
  if (role !== 'sales' && role !== 'Sales Panel') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default SalesProtectedRoute;
