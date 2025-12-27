import { useState } from 'react';
import { Bookmark, LayoutGrid, Store, Search, Heart } from 'lucide-react';
import DashboardContainer from '@/layout/DashboardContainer';
import ProfileCard from '@/components/dashboard/ProfileCard';
import SidebarWidget from '@/components/dashboard/SidebarWidget';
import ChatList from '@/components/dashboard/ChatList';
import { useAuthContext } from '@/context/auth-provider';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useChats } from '@/hooks/api/use-chat';
import { cn } from '@/lib/utils';

// We'll build these next
import BookmarkedPosts from '@/components/bookmark/BookmarkPost';
import { Navigate } from 'react-router-dom';
import BookmarkedBusinesses from '@/components/bookmark/BookmarkBusiness';
import WishlistTab from '@/components/bookmark/ProductWishlist';

const BookmarkPage = () => {
  const { user, related } = useAuthContext();
  const isDesktop = useIsDesktop();
  const [activeTab, setActiveTab] = useState<'posts' | 'businesses' | 'wishlist'>('posts');

  const { chats, isLoading: isChatsLoading, isError: chatError } =
    useChats(isDesktop ? { enabled: true } : { enabled: false });

  const tabs = [
    { id: 'posts', label: 'Saved Posts', icon: LayoutGrid },
    { id: 'wishlist', label: 'Wishlist', icon: Heart }, // New Tab
    { id: 'businesses', label: 'Following', icon: Store },
  ];

  if (!user || !related) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <DashboardContainer
      leftColumn={
        <div className="sticky top-8 space-y-6">
          <ProfileCard user={user} related={related} />
          <SidebarWidget isDesktop={isDesktop} isError={chatError} errorTitle="Recent Chats">
            <ChatList chatList={chats} isError={chatError} />
          </SidebarWidget>
        </div>
      }
    >
      {/* HEADER SECTION */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-600 rounded-2xl shadow-lg shadow-orange-100">
              <Bookmark className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Library</h1>
              <p className="text-sm text-gray-500 font-medium">Quick access to everything you've saved</p>
            </div>
          </div>
        </div>

        {/* CUSTOM TABS */}
        <div className="flex p-1.5 bg-gray-50 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap min-w-max gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER CONTENT BASED ON TAB */}
      <div className="min-h-[500px]">
        {activeTab === 'posts' && <BookmarkedPosts />}
        {activeTab === 'wishlist' && <WishlistTab />}
        {activeTab === 'businesses' && <BookmarkedBusinesses />}
      </div>
    </DashboardContainer>
  );
};

export default BookmarkPage;