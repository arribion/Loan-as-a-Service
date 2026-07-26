import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { type Role } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  role: Role;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/member"} replace />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
