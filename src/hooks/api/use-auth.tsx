import { AxiosError } from 'axios';
import { getCurrentUserQueryFn } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/token-storage';

const useAuth = () => {
  const hasToken = tokenStorage.hasToken();

  const query = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUserQueryFn,
    staleTime: 1000 * 60 * 5,
    enabled: hasToken,
    retry: (count, error: AxiosError) => {
      if (error.response?.status === 401) return false;
      return count < 2;
    },
  });

  const data = query.data;
  const user = data?.user;
  const related = data?.related;

  const isAuthenticated = Boolean(hasToken && user && !query.error);

  return {
    ...query,
    user,
    related,
    isAuthenticated,
  };
};

export default useAuth;
