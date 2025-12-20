import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/auth-provider';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useChats } from '@/hooks/api/use-chat';
import { useActivity } from '@/hooks/api/use-activity';
import { useBookmarks } from '@/hooks/api/use-bookmark';

import DashboardContainer from '@/layout/DashboardContainer';
import { DashboardSkeleton } from '@/components/skeleton/DashboardSkeleton';
import SidebarWidget from '@/components/dashboard/SidebarWidget';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ChatList from '@/components/dashboard/ChatList';
import ShareBox from '@/components/dashboard/ShareBox';
import AllFeed from '@/components/feed/AllFeed';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import BookmarkList from '@/components/dashboard/BookmarkList';

const Dashboard = () => {
  const { user, related, isLoading: isContextLoading } = useAuthContext();
  const isDesktop = useIsDesktop();

  // API Hooks
  const { chats, isLoading: isChatsLoading, isError: chatError } = 
    useChats(isDesktop ? { enabled: true } : { enabled: false });
  
  const { activities, isLoading: isActivitiesLoading, isError: isActivityError } = 
    useActivity(isDesktop ? { enabled: true } : { enabled: false });
  
  const { bookmarks, isLoading: isBookmarksLoading, isError: isBookmarksError } = 
    useBookmarks(isDesktop ? { enabled: true } : { enabled: false });

  // 1. Loading State
  if (isContextLoading || isChatsLoading || isActivitiesLoading || isBookmarksLoading) {
    return <DashboardSkeleton />;
  }

  // 2. Auth Guard
  if (!user || !related) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <DashboardContainer
      // --- LEFT SIDE ---
      leftColumn={
        <>
          <ProfileCard user={user} related={related} />
          <SidebarWidget 
            isDesktop={isDesktop} 
            isError={chatError} 
            errorTitle="Failed to load chats"
          >
            <ChatList chatList={chats} isError={chatError} />
          </SidebarWidget>
        </>
      }
      // --- RIGHT SIDE ---
      rightColumn={
        <>
          <SidebarWidget 
            isDesktop={isDesktop} 
            isError={isActivityError} 
            errorTitle="Failed to load activity"
          >
            <ActivityPanel activities={activities} isError={false} />
          </SidebarWidget>

          <SidebarWidget 
            isDesktop={isDesktop} 
            isError={isBookmarksError} 
            errorTitle="Failed to load bookmarks"
          >
            <BookmarkList bookmarks={bookmarks} isLoading={false} isError={false} />
          </SidebarWidget>
        </>
      }
    >
      <ShareBox />
      <AllFeed />
    </DashboardContainer>
  );
};

export default Dashboard;