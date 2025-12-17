// src/pages/Dashboard.tsx
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import BookmarkList from '@/components/dashboard/BookmarkList';
import ChatList from '@/components/dashboard/ChatList';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ShareBox from '@/components/dashboard/ShareBox';
import { useAuthContext } from '@/context/auth-provider';
import { DashboardSkeleton } from '@/components/skeleton/DashboardSkeleton';
import { Navigate } from 'react-router-dom';
import { useChats } from '@/hooks/api/use-chat';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useActivity } from '@/hooks/api/use-activity';
import { useBookmarks } from '@/hooks/api/use-bookmark';
import SidebarWidget from '@/components/dashboard/SidebarWidget';
import AllFeed from '@/components/feed/AllFeed';

const Dashboard = () => {
  const { user, related, isLoading: isContextLoading } = useAuthContext();
  const isDesktop = useIsDesktop(); // <-- Check screen size here

  // We only run useChats if we are on a desktop view.
  const {
    chats,
    isLoading: isChatsLoading,
    isError: chatError
  } = useChats(isDesktop ? { enabled: true } : { enabled: false });
  
  const {
    activities,
    isLoading: isActivitiesLoading,
    isError: isActivityError
  } = useActivity(isDesktop ? { enabled: true } : { enabled: false });
  
  const {
    bookmarks,
    isLoading: isBookmarksLoading,
    isError: isBookmarksError
  } = useBookmarks(isDesktop ? { enabled: true } : { enabled: false });

  if (isContextLoading || isChatsLoading || isActivitiesLoading || isBookmarksLoading) {
    return <DashboardSkeleton />;
  }

  if (!user || !related) {
    // Handle the case where the user is not logged in or data is missing
    return <Navigate to="/auth/login" replace />;
  }


  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <ProfileCard user={user} related={related} />
          {/* ChatList visible only on desktop */}
          <div className="hidden lg:block">
            <SidebarWidget 
            isDesktop={isDesktop} 
            isError={chatError} 
            errorTitle="Failed to load chats"
          >
            <ChatList chatList={chats} isError={chatError} />
          </SidebarWidget>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="space-y-6 lg:col-span-2 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ShareBox />
          <AllFeed />
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
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
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;


