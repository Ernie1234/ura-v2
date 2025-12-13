// src/components/BookmarkDashboard.tsx
import React, { useState } from 'react';
import PostGrid from '@/components/bookmark/PostGrid';
import MerchantList from '@/components/bookmark/MerchantList';

// Assuming ProfileCard and ChatList are imported correctly
import ProfileCard from '@/components/dashboard/ProfileCard'; 
import ChatList from '@/components/dashboard/ChatList'; 

const Bookmark: React.FC = () => {
  // 'post' tab aligns with the desktop design's initial view
  const [activeTab, setActiveTab] = useState<'post' | 'user'>('post');

  return (
    // Use the same responsive container setup as before
    <div className="min-h-screen bg-[#FFF9F6] lg:py-8 px-0 sm:px-4">
      
      <div className="mx-auto max-w-7xl lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SIDEBAR (Desktop Only - Profile/Activity/Chat) */}
        {/* Note: I'm replacing ChatList with Activity/Bookmarks in the sidebar to better match the desktop design (image_76c23d.jpg) which shows Activity and Bookmarks */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <ProfileCard />
          {/* Activity/Chat Placeholder - Adjusting based on image_76c23d.jpg */}
          <div className="p-4 bg-white rounded-xl shadow-sm">
             <h3 className="font-bold text-lg mb-4">Activity</h3>
             {/* Replace with your Activity List component */}
             <div className="text-sm text-gray-500"> <ChatList /> </div>
          </div>
        </aside>

        {/* Right Column (Content Area) - Takes up full width on mobile */}
        <div className="lg:col-span-3 flex flex-col bg-white lg:rounded-xl lg:shadow-xl">
            
            {/* Title for Desktop */}
            <h2 className="hidden lg:block text-2xl font-bold p-8 pb-0 text-gray-900">
                Bookmark
            </h2>
            <p className="hidden lg:block text-gray-600 px-8 mb-4">See saved posts and profiles.</p>
          
            {/* Tabs */}
            <div className="flex border-b px-4 lg:px-8 pt-4 lg:pt-0">
                <button
                    onClick={() => setActiveTab('post')}
                    className={`py-3 px-2 text-base lg:text-lg font-semibold transition-colors ${
                        activeTab === 'post'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Saved Posts
                </button>
                <button
                    onClick={() => setActiveTab('user')}
                    className={`py-3 px-2 text-base lg:text-lg font-semibold transition-colors ml-6 ${
                        activeTab === 'user'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Saved Users
                </button>
            </div>
            
            {/* Content Area */}
            <div className="p-4 lg:p-6">
                {activeTab === 'post' ? <PostGrid /> : <MerchantList />}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmark;