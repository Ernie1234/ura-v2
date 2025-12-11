// src/hooks/api/use-user-profile.ts
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/profile";

export const useUserProfile = (userId?: string | null) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await getUserProfile(userId);
      return res;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};
