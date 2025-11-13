import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { DashboardSkeleton } from "@/components/skeleton/DashboardSkeleton";

const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // If there's an error or user is not authenticated, redirect to login
  if (error || !isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
