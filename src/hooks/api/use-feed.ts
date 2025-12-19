import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { fetchPostFeedQueryFn, createPostMutationFn } from '@/lib/api';
import { uploadImageToCloudinary } from '@/services/cloudinary.service';
import { toast } from 'sonner';
import type { UnifiedPost, PostData } from '@/types/post';

/**
 * Hook to fetch the unified feed
 */
export const useFeed = (options: Omit<UseQueryOptions<UnifiedPost[]>, 'queryKey' | 'queryFn'> = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery<UnifiedPost[]>({
    queryKey: ['posts-feed'],
    queryFn: fetchPostFeedQueryFn,
    staleTime: 1000 * 60 * 5,
    ...options
  });

  return {
    posts: data ?? [],
    isLoading,
    isError,
    error,
    refetch
  };
};



export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostMutationFn,
    onSuccess: (response) => {
      toast.success(response.message || "Action successful!");
      // Invalidate both feed and user product inventory
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    },
  });
};