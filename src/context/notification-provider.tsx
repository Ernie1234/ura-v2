import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socketService } from '@/services/socket.service';
import { useAuthContext } from './auth-provider';
import API from '@/lib/axios-client'; 

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    relatedId?: string;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[]; // Added this
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    resetCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, isAuthenticated } = useAuthContext();

    // 1. Fetch notifications list
// Inside NotificationProvider.tsx

const fetchNotifications = useCallback(async () => {
    try {
        const response = await API.get('/log/notifications');
        
        // Safety check: handle both { data: [...] } and directly [...] 
        const rawData = response.data?.data || response.data || [];
        
        // Ensure rawData is actually an array before setting
        const dataArray = Array.isArray(rawData) ? rawData : [];
        
        setNotifications(dataArray);
        
        const unread = dataArray.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
    } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]); // Set to empty array on error to prevent crashes
    }
}, []);

    // 2. Mark single as read
    const markAsRead = async (id: string) => {
        try {
            await API.patch(`/log/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Error marking read", err);
        }
    };

    // 3. Mark all as read
    const markAllAsRead = async () => {
        try {
            await API.post('/log/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Error marking all read", err);
        }
    };

    // 4. Clear all notifications
    const clearAll = async () => {
        try {
            await API.delete('/log/notifications/clear-all');
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Error clearing notifications", err);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchNotifications();

            // Listen for real-time notifications
            socketService.on('notification_received', (newNotif) => {
                // Add new notification to the top of the list
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            socketService.off('notification_received');
        };
    }, [isAuthenticated, user, fetchNotifications]);

    const resetCount = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            fetchNotifications,
            markAsRead, 
            markAllAsRead, 
            clearAll, 
            resetCount 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotificationContext must be used within NotificationProvider');
    return context;
};