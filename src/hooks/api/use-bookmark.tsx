// src/hooks/api/use-bookmarks.ts

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { fetchBookmarkList } from '@/lib/api';

import type { Bookmark } from '@/types/api.types';


type BookmarkQueryOptions = Omit<UseQueryOptions<Bookmark[]>, 'queryKey' | 'queryFn'>;

export const useBookmarks = (options: BookmarkQueryOptions = {}) => {
  const { data, isLoading, isError, error } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarkList,
    ...options,
  });

  return {
    bookmarks: data ?? [],
    isLoading,
    isError,
    error,
  };
};