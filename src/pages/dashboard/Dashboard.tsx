// src/pages/Dashboard.tsx
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import BookmarkList from '@/components/dashboard/BookmarkList';
import ChatList from '@/components/dashboard/ChatList';
import PostFeed from '@/components/dashboard/PostFeed';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ShareBox from '@/components/dashboard/ShareBox';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <ProfileCard />
          {/* ChatList visible only on desktop */}
          <div className="hidden lg:block">
            <ChatList />
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="space-y-6 lg:col-span-2 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ShareBox />
          <PostFeed />
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <ActivityPanel />
          <BookmarkList />
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;
