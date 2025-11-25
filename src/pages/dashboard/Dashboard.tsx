// src/pages/Dashboard.tsx

import ActivityPanel from '@/components/dashboard/ActivityPanel';
import BookmarkList from '@/components/dashboard/BookmarkList';
import ChatList from '@/components/dashboard/ChatList';
import PostFeed from '@/components/dashboard/PostFeed';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ShareBox from '@/components/dashboard/ShareBox';

const Dashboard = () => {
  return (
    <div className="bg-[#FFF9F6] min-h-screen py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 lg:grid-cols-4">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          <ProfileCard />
          <ChatList />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-2 space-y-6">
          <ShareBox />
          <PostFeed />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-1">
          <ActivityPanel />
          <BookmarkList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
