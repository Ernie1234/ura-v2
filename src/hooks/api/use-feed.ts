import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { fetchPostFeedQueryFn, createPostMutationFn } from '@/lib/api';
import type { FeedItem } from '@/types/feed.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImageToCloudinary } from '@/services/cloudinary.service'; // Your helper
import { toast } from 'sonner';
/**
 * Custom hook to fetch the unified feed (Posts and Products).
 */
type FeedQueryOptions = Omit<UseQueryOptions<FeedItem[]>, 'queryKey' | 'queryFn'>;

export const useFeed = (options: FeedQueryOptions = {}) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<FeedItem[]>({
        queryKey: ['posts-feed'],
        queryFn: fetchPostFeedQueryFn,
        staleTime: 1000 * 60 * 5, // 5 minutes
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
      toast.success(response.message || "Published successfully!");
      // Refresh posts list so the new product appears immediately
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    },
  });
};