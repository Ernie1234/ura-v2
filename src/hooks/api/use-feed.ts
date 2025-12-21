import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { fetchPostFeedQueryFn, createPostMutationFn, postService, toggleLikeApi, toggleWishlist, toggleBookmarkApi } from '@/lib/api';
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


export const usePostsFeed = (targetId?: string, restrict: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ["posts-feed", { targetId, restrict }],
    queryFn: ({ pageParam = 1 }) => 
      postService.getSocialPosts({ targetId, restrict, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length < 15 ? undefined : allPages.length + 1,
    staleTime: 1000 * 60 * 5, 
  });
};


export const useProductsFeed = (targetId?: string, restrict: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ["products-feed", { targetId, restrict }],
    queryFn: ({ pageParam = 1 }) => 
      postService.getProductPosts({ targetId, restrict, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length < 15 ? undefined : allPages.length + 1,
    staleTime: 1000 * 60 * 5,
  });
};


export const useToggleWishlist = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleWishlist(productId),
    
    // 1. Optimistic Update Logic
    onMutate: async () => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["products-feed"] });

      // Snapshot the previous state
      const previousData = queryClient.getQueryData(["products-feed"]);

      // Manually update the cache
      queryClient.setQueryData(["products-feed"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => 
            page.map((product: any) => 
              product._id === productId 
                ? { ...product, isWishlisted: !product.isWishlisted } 
                : product
            )
          ),
        };
      });

      return { previousData };
    },

    // 2. Error Handling (Rollback)
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["products-feed"], context?.previousData);
      toast.error("Failed to update wishlist. Please try again.");
    },

    // 3. Final Sync
    onSettled: () => {
      // Refetch in background to ensure we are perfectly in sync with DB
      queryClient.invalidateQueries({ queryKey: ["products-feed"] });
    },
  });
};


export const useToggleLike = (targetId: string, targetType: 'post' | 'product') => {
  const queryClient = useQueryClient();
  const queryKey = targetType === 'post' ? ["posts-feed"] : ["products-feed"];

  return useMutation({
    mutationFn: () => toggleLikeApi(targetId, targetType),
    
    onMutate: async () => {
      // 1. Cancel background refetches so they don't overwrite us
      await queryClient.cancelQueries({ queryKey });

      // 2. Save snapshot of current data
      const previousData = queryClient.getQueryData(queryKey);

      // 3. Optimistically update the cache
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => {
            // Standardize: API might return { posts: [] } or just []
            const items = Array.isArray(page) ? page : (page.posts || page.products || page.data);
            
            const updatedItems = items.map((item: any) =>
              item._id === targetId
                ? { 
                    ...item, 
                    isLiked: !item.isLiked, 
                    likesCount: item.isLiked ? Math.max(0, item.likesCount - 1) : item.likesCount + 1 
                  }
                : item
            );

            // Rebuild the page structure correctly
            return Array.isArray(page) ? updatedItems : { ...page, [page.posts ? 'posts' : 'products']: updatedItems };
          }),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      // Rollback to original state if API fails
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error("Failed to update like");
    },

    onSettled: () => {
      // Background sync to ensure local state matches server perfectly
      queryClient.invalidateQueries({ queryKey });
    },
  });
};


export const useToggleBookmark = (targetId: string, targetType: 'Post' | 'Business', profileKey?: any[]) => {
  const queryClient = useQueryClient();
  
  // 1. Determine which list to update
  const listKey = targetType === 'Post' ? ["posts-feed"] : ["business-list"];

  return useMutation({
    mutationFn: () => toggleBookmarkApi(targetId, targetType),

    onMutate: async () => {
      // Cancel outgoing fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: listKey });
      if (profileKey) await queryClient.cancelQueries({ queryKey: profileKey });

      const previousListData = queryClient.getQueryData(listKey);
      const previousProfileData = profileKey ? queryClient.getQueryData(profileKey) : null;

      // OPTIMISTIC UPDATE: The List (Feed)
      queryClient.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages?.map((page: any) => {
            const items = Array.isArray(page) ? page : (page.posts || page.businesses || page.data);
            if (!items) return page;

            const updatedItems = items.map((item: any) =>
              item._id === targetId ? { ...item, isBookmarked: !item.isBookmarked } : item
            );

            if (Array.isArray(page)) return updatedItems;
            const keyName = page.posts ? 'posts' : (page.businesses ? 'businesses' : 'data');
            return { ...page, [keyName]: updatedItems };
          }),
        };
      });

      // OPTIMISTIC UPDATE: The Individual Profile (Detail Page)
      if (profileKey) {
        queryClient.setQueryData(profileKey, (old: any) => {
          if (!old) return old;
          // Matches your ProfileInfo logic: related.isBookmarked
          return {
            ...old,
            related: {
              ...old.related,
              isBookmarked: !old.related?.isBookmarked
            }
          };
        });
      }

      return { previousListData, previousProfileData };
    },

    onError: (err, variables, context) => {
      // Rollback both caches if the API fails
      queryClient.setQueryData(listKey, context?.previousListData);
      if (profileKey) queryClient.setQueryData(profileKey, context?.previousProfileData);
      toast.error("Failed to update bookmark");
    },

    onSettled: () => {
      // Final sync with server
      queryClient.invalidateQueries({ queryKey: listKey });
      if (profileKey) queryClient.invalidateQueries({ queryKey: profileKey });
    },
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