import { useQuery } from "@tanstack/react-query";
import { tokenStorage } from "@/lib/token-storage";
import { mockApi } from "@/services/mockApi";
import { getCurrentUserQueryFn } from "@/lib/api"; // real backend fn
import { AxiosError } from "axios";

/**
 * This flag controls whether we use backend or mock data.
 * Later, set USE_MOCK_API = false and everything works automatically.
 */
const USE_MOCK_API = true;

const useAuth = () => {
  const hasToken = tokenStorage.hasToken();
  const enabled = USE_MOCK_API || hasToken; // always enabled in mock mode

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      if (USE_MOCK_API) {
        return await mockApi.get("currentUser"); 
      }
      return await getCurrentUserQueryFn();
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 10,
  });

  const data = query.data ?? null;

  const user = data?.user ?? null;
  const related = data?.related ?? null;
  const isAuthenticated = Boolean(user);

  return {
    ...query,
    user,
    related,
    isAuthenticated,
  };
};


export default useAuth;
