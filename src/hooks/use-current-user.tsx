import { useAuthContext } from '@/context/auth-provider';

/**
 * Hook to get the current authenticated user and related auth state
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, logout } = useCurrentUser();
 *
 * if (user) {
 *   console.log(user.name, user.email);
 * }
 * ```
 */
export const useCurrentUser = () => {
  const context = useAuthContext();

  return {
    user: context.user,
    related: context.related,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    isFetching: context.isFetching,
    error: context.error,
    logout: context.logout,
    isLoggingOut: context.isLoggingOut,
    refetchAuth: context.refetchAuth,
  };
};
