// src/hooks/api/use-activity.ts

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { Activity } from '@/types/api.types'; // Define Activity type accordingly
import { fetchActivityList } from '@/lib/api';

/**
 * Custom hook to fetch the list of recent user activities.
 */
type ActivityQueryOptions = Omit<UseQueryOptions<Activity[]>, 'queryKey' | 'queryFn'>;

export const useActivity = (options: ActivityQueryOptions = {}) => {
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery<Activity[]>({
        queryKey: ['activityList'],
        queryFn: fetchActivityList,
        refetchInterval: 60000, 
        ...options // <-- Spread the options here
    });
    console.log("Activity Data:", data);

    return {
        activities: data ?? [], 
        isLoading,
        isError,
        error,
    };
};