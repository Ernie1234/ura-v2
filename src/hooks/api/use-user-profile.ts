import { getUserQueryFn } from "@/lib/api";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProfileMutationFn, updateBusinessMutationFn } from "@/lib/api";
import { toast } from "react-hot-toast";

export const useUserProfile = (userId: string | undefined, shouldFetch: boolean) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserQueryFn(userId!),
    enabled: !!userId && shouldFetch,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a 404 (User not found)
      if (error?.response?.status === 404) return false;
      // Retry up to 2 times for other errors (network/500)
      return failureCount < 2;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileMutationFn,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      // Refetch user data everywhere in the app
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBusinessMutationFn,
    onSuccess: () => {
      toast.success("Business details saved!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Business update failed");
    },
  });
};