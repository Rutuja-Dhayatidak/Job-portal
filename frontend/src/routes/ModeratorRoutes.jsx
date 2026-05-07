import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ModeratorRoutes = () => {
  const token = localStorage.getItem('moderatorToken') || localStorage.getItem('token');
  const role = localStorage.getItem('moderatorRole') || localStorage.getItem('role');

  const isAuthorized = token && ['moderator', 'Moderator', 'trust_safety', 'Trust & Safety', 'superAdmin'].includes(role);

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ModeratorRoutes;
