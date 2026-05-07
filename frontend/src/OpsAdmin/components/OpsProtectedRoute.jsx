import React from 'react';
import { Navigate } from 'react-router-dom';

const OpsProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || (role !== 'OPS Admin' && role !== 'Ops Admin' && role !== 'superAdmin')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default OpsProtectedRoute;
