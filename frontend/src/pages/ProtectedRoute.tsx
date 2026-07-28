// pages/ProtectedRoute.tsx
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { type Role } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on role
    const redirectPath =
      user.role === "admin" || user.role === "loan_officer"
        ? "/admin"
        : "/member";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
