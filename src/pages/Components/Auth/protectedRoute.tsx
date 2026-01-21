// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute: React.FC = () => {
//   const token = localStorage.getItem('token');

//   // If there is no token, redirect to login page
//   if (!token) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   // If token exists, render the children (which will be the Layout and sub-routes)
//   return <Outlet />;
// };

// export default ProtectedRoute;



import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: ("Admin" | "Teacher" | "Student")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole"); // Admin | Teacher | Student

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role as "Admin" | "Teacher" | "Student")) {
    alert("You do not have permission to access this page.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
