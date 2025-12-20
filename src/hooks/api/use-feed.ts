import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { fetchPostFeedQueryFn, createPostMutationFn } from '@/lib/api';
import { uploadImageToCloudinary } from '@/services/cloudinary.service';
import { toast } from 'sonner';
import type { UnifiedPost } from '@/types/feed.types';
import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Hook to fetch the unified feed
 */
// src/hooks/api/use-feed.ts
export const useFeed = (
  userId?: string, // Optional userId
  options: Omit<UseQueryOptions<UnifiedPost[]>, 'queryKey' | 'queryFn'> = {}
) => {
  const { data, isLoading, isError, error, refetch } = useQuery<UnifiedPost[]>({
    // Adding userId to the queryKey ensures the feed refreshes when switching profiles
    queryKey: ['posts-feed', userId || 'me'], 
    queryFn: () => fetchPostFeedQueryFn(userId), // Pass userId to your API function
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

// src/hooks/api/use-feed.ts

// src/hooks/api/use-feed.ts
export const useInfiniteFeed = (userId?: string) => {
  return useInfiniteQuery({
    queryKey: ['posts-feed', userId || 'me'],
    queryFn: ({ pageParam = 1 }) => fetchPostFeedQueryFn(userId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer than 20 posts, we've reached the end
      return lastPage.length < 20 ? undefined : allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
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