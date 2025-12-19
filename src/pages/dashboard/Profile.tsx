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

const TABS = {
  FEEDS: "Feeds",
  POSTS: "Posts",
  PRODUCTS: "Products",
  ABOUT: "About",
  REVIEWS: "Reviews",
} as const;

// ... imports stay the same

const ProfilePage: React.FC = () => {
  const { userId, businessId } = useParams<{ userId?: string; businessId?: string }>();
  const { user: currentUser } = useAuthContext();


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

    // Use userProfile.business to decide if business tabs should exist
    const showBusinessTabs = !!userProfile.business;

    switch (activeTab) {
      case TABS.FEEDS: return <AllFeed entityId={targetId} />;
      case TABS.POSTS: return (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <PostsFeed filters={{ authorId: targetId }} />
        </div>
      );
      case TABS.PRODUCTS: return showBusinessTabs ? (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <ProductsFeed filters={{ businessId: targetId }} />
        </div>
      ) : null;
      case TABS.ABOUT: return (
        <div className="lg:hidden">
          <ProfileAbout profile={userProfile} />
        </div>
      );
      case TABS.REVIEWS: return showBusinessTabs ? ( // FIX: Changed 'isOwner' (undefined) to 'showBusinessTabs'
        <div className="bg-white rounded-xl shadow-sm border">
          <ReviewsSection filters={{ businessId: targetId }}/>
        </div>
      ) : null;
      default: return null;
    }
  };

  if (isLoading && !userProfile) return <DashboardSkeleton />;

  // Guard for JSX rendering
  if (!userProfile?.user) return <DashboardSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-in fade-in duration-500">
      <ProfileHeader profile={userProfile} />

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <ProfileInfo
              user={userProfile.user}
              business={userProfile.business}
              related={userProfile.related}
              isMe={isMe}
            />
          </div>
        </aside>

        <main className="lg:col-span-2">
          <ProfileTabs
            active={activeTab}
            onChange={setActiveTab}
            // FIX: Use userProfile.business to show business tabs, 
            // not userProfile.user.isBusinessOwner (which refers to the person's status, not the page type)
            isBusiness={!!userProfile.business}
          />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

