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


/**
 * HOOK: useToggleLike
 * Handles instant liking of Posts or Products and syncs globally.
 */
export const useToggleLike = (targetId: string, targetType: 'post' | 'product') => {
  const queryClient = useQueryClient();
  
  // The primary list this mutation belongs to
  const queryKey = targetType === 'post' ? ["posts-feed"] : ["products-feed"];

  return useMutation({
    mutationFn: () => toggleLikeApi(targetId, targetType),

    onMutate: async () => {
      // 1. Cancel background refetches for this key so they don't overwrite us
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot the current data for rollback if it fails
      const previousData = queryClient.getQueryData(queryKey);

      // 3. Optimistically update the cache
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => {
            // Handle different API response structures (arrays or paginated objects)
            const items = Array.isArray(page) 
              ? page 
              : (page.posts || page.products || page.data || []);

            const updatedItems = items.map((item: any) =>
              item._id === targetId
                ? {
                    ...item,
                    isLiked: !item.isLiked,
                    likesCount: item.isLiked 
                      ? Math.max(0, (item.likesCount || 0) - 1) 
                      : (item.likesCount || 0) + 1
                  }
                : item
            );

            // Return the data in the same format it arrived
            return Array.isArray(page) 
              ? updatedItems 
              : { ...page, [page.posts ? 'posts' : 'products']: updatedItems };
          }),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      // If the API fails, roll back to the state before the click
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error("Failed to update like");
    },

    onSuccess: () => {
      // 4. GLOBAL SYNC: Tell React Query to refresh ALL feeds in the background.
      // This ensures if the post exists in "Feeds" AND "Profile", both update.
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
      queryClient.invalidateQueries({ queryKey: ["products-feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      console.log("Like synced globally");
    }
  });
};

/**
 * HOOK: useToggleBookmark
 * Handles instant bookmarking and ensures the "Saved" status is updated everywhere.
 */
export const useToggleBookmark = (
  targetId: string,
  targetType: 'Post' | 'Business',
  profileKey?: any[] // Optional key for profile-specific pages
) => {
  const queryClient = useQueryClient();
  
  // Primary key (Business list or Post feed)
  const listKey = targetType === 'Post' ? ["posts-feed"] : ["business-list"];

  return useMutation({
    mutationFn: () => toggleBookmarkApi(targetId, targetType),

    onMutate: async () => {
      // 1. Cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey: listKey });
      if (profileKey) await queryClient.cancelQueries({ queryKey: profileKey });

      // 2. Snapshot for rollback
      const previousListData = queryClient.getQueryData(listKey);
      const previousProfileData = profileKey ? queryClient.getQueryData(profileKey) : null;

      // 3. Optimistic Update for Lists/Feeds
      queryClient.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages?.map((page: any) => {
            const items = Array.isArray(page) 
              ? page 
              : (page.posts || page.businesses || page.data || []);

            const updatedItems = items.map((item: any) =>
              item._id === targetId ? { ...item, isBookmarked: !item.isBookmarked } : item
            );

            return Array.isArray(page) 
              ? updatedItems 
              : { ...page, [page.posts ? 'posts' : 'data']: updatedItems };
          }),
        };
      });

      // 4. Optimistic Update for Profile Page (The "related" block)
      if (profileKey) {
        queryClient.setQueryData(profileKey, (old: any) => {
          if (!old) return old;
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
      // Rollback on error
      queryClient.setQueryData(listKey, context?.previousListData);
      if (profileKey) queryClient.setQueryData(profileKey, context?.previousProfileData);
      toast.error("Failed to save bookmark");
    },

    onSuccess: () => {
      // 5. GLOBAL SYNC: Refresh all saved data stores in background
      queryClient.invalidateQueries({ queryKey: ["business-list"] });
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarked-items"] });
      
      if (profileKey) {
        queryClient.invalidateQueries({ queryKey: profileKey });
      }
      console.log("Bookmark synced globally");
    }
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