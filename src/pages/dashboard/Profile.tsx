import React, { useMemo, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";
import { useUserProfile } from "@/hooks/api/use-user-profile";

// Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileAbout from "@/components/profile/ProfileAbout";
import PostsFeed from "@/components/feed/PostFeed";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ReviewsSection from "@/components/profile/ReviewSection";
import AllFeed from "@/components/feed/AllFeed";
import ProductsFeed from "@/components/feed/PostFeed";
import { DashboardSkeleton } from "@/components/skeleton/DashboardSkeleton";

// Types - Use the central ProfileResponse to avoid assignment conflicts
import type { ProfileResponse } from "@/types/api.types";
import FollowList from "@/components/profile/FollowList";

const TABS = {
  FEEDS: "Feeds",
  POSTS: "Posts",
  PRODUCTS: "Products",
  ABOUT: "About",
  REVIEWS: "Reviews",
  FOLLOWERS: "Followers", // New
  FOLLOWING: "Following", // New
} as const;

const ProfilePage: React.FC = () => {
  const { userId, businessId } = useParams<{ userId?: string; businessId?: string }>();
  const { user: currentUser } = useAuthContext();

  if (!currentUser) {
    return <DashboardSkeleton />; // Or return null
  }

  const isBusinessProfile = location.pathname.includes("/business/");
  const targetId = businessId || userId;

  const [activeTab, setActiveTab] = useState<string>(TABS.FEEDS);

  const isMe = useMemo(() => {
    if (!currentUser || !targetId) return false;
    if (isBusinessProfile) {
      // Check if current user owns the business being viewed
      return currentUser.business?._id === targetId;
    }
    return currentUser._id === targetId;
  }, [currentUser, targetId, isBusinessProfile]);

  // Inside ProfilePage.tsx

  const { data: profile, isLoading, isError, error } = useUserProfile(
    targetId,
    isBusinessProfile
  );

  const userProfile = useMemo(() => {
    // 1. If we have fetched data from the server, use it (most accurate)
    if (profile) return profile as unknown as ProfileResponse;

    // 2. If no server data yet, but I am looking at MYSELF, use context data
    if (isMe && currentUser) {
      return {
        user: currentUser,
        business: currentUser.isBusinessOwner ? currentUser.business : null,
        related: {
          counts: { posts: 0, followers: 0, following: 0 },
          stats: { rating: 0, reviewsCount: 0 }
        }
      } as unknown as ProfileResponse;
    }

    return null;
  }, [profile, isMe, currentUser]);
  // --- CRITICAL FIXES BELOW ---


const renderTabContent = () => {
  if (!userProfile) return null;
  
  const isBusiness = !!userProfile.business;
  
  // Ensure displayName is always a string
  const displayName = (isBusiness 
    ? userProfile.business?.businessName 
    : userProfile.user?.firstName) || "User";

  switch (activeTab) {
    case TABS.FEEDS: return <AllFeed userId={targetId!} />;
    case TABS.POSTS: return <PostsFeed targetId={targetId!} />;
    case TABS.PRODUCTS:
      return isBusiness ? <ProductsFeed targetId={targetId!} /> : null;
    
    case TABS.FOLLOWERS:
      return (
        <FollowList
          targetId={targetId!}
          type="followers"
          currentUser={currentUser}
        />
      );

    case TABS.FOLLOWING:
      return !isBusiness ? (
        <FollowList
          targetId={targetId!}
          type="following"
          currentUser={currentUser}
        />
      ) : null;

    case TABS.REVIEWS: 
      return isBusiness ? <ReviewsSection filters={{ businessId: targetId! }} /> : null;
    case TABS.ABOUT: 
      return <ProfileAbout profile={userProfile} />;
    default: 
      return null;
  }
};

  if (isLoading && !userProfile) return <DashboardSkeleton />;

  // Guard for JSX rendering
  if (!userProfile?.user) return <DashboardSkeleton />;

  return (
    /* 1. Wrapper: Changed max-w to 7xl and increased py to give the header more air */
    <div className="min-h-screen bg-[#FFF9F6] pt-6 pb-10 px-4 lg:px-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Profile Header stays at the top */}
        <ProfileHeader profile={userProfile} isBusiness={isBusinessProfile} />

        {/* 2. Grid: items-start prevents the sidebar from stretching unnecessarily */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">

          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-1">
            {/* Added a subtle wrapper for the info card to ensure it feels separate */}
            <div className="bg-white rounded-[25px] p-4 lg:py-8 border border-gray-100/80 shadow-sm overflow-hidden">
              <ProfileInfo
                user={userProfile.user}
                business={userProfile.business}
                related={userProfile.related}
                isMe={isMe}
              />
            </div>
          </aside>

          {/* MAIN CONTENT COLUMN */}
          <main className="lg:col-span-2 flex flex-col">
            {/* 3. Tabs: Added a small bottom margin and ensured they don't scroll away */}
            <div className="mb-2">
              <ProfileTabs
                tabs={Object.values(TABS)}
                active={activeTab}
                onChange={setActiveTab}
                isBusiness={!!userProfile.business}
              />
            </div>

            {/* 4. SCROLLABLE AREA: Added your custom scrollbar ID and adjusted height */}
            <div
              id="main-feed-container" // This triggers your custom CSS scrollbar
              className="mt-4 overflow-y-auto pr-3 scroll-smooth"
              /* Adjusted height: 100vh minus header and tabs space */
              style={{ maxHeight: 'calc(100vh - 180px)' }}
            >
              <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-4 duration-500">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

