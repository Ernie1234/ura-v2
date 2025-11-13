import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { tokenStorage } from "@/lib/token-storage";

/**
 * Hook to fetch and manage authenticated user data
 * @returns React Query result with user data and authentication state
 */
const useAuth = () => {
  const hasToken = tokenStorage.hasToken();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    // Only fetch if we have a token
    enabled: hasToken,
  });

  return {
    ...query,
    user: query.data?.user,
    related: query.data?.related,
    isAuthenticated: hasToken && !!query.data?.user && !query.error,
  };
};

export default useAuth;
