import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');

  // If there is no token, redirect to login page
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // If token exists, render the children (which will be the Layout and sub-routes)
  return <Outlet />;
};

export default ProtectedRoute;