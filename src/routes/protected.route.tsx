import useAuth from '@/hooks/api/use-auth';
import { Navigate, Outlet } from 'react-router-dom';
// import { DashboardSkeleton } from '@/components/skeleton/DashboardSkeleton';
import { FullPageSpinner } from '@/components/ui/FullpageSpinner';

const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />; // Quick check: "Who is this user?"
  }

  if (error || !isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />; // Moves to the specific Page
};

export default ProtectedRoute;
