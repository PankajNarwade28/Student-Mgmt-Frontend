import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface ProtectedRouteProps {
  allowedRoles?: ("Admin" | "Teacher" | "Student")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole") as
    | "Admin"
    | "Teacher"
    | "Student"
    | null;

  const shown = useRef(false);

  // SIDE EFFECT → alert only once
  useEffect(() => {
    if (
      token &&
      allowedRoles &&
      role &&
      !allowedRoles.includes(role) &&
      !shown.current
    ) {
      // alert("You do not have permission to access this page.");
      toast.error("You do not have permission to access this page.");
      shown.current = true;
    }
  }, [allowedRoles, role, token]);

  // No token → login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role not allowed → redirect
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
