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

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuthContext();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(TABS.POSTS);

  // 1. Ownership Check
  const isMe = useMemo(() =>
    !!(currentUser?._id && userId && currentUser._id === userId),
    [currentUser?._id, userId]
  );

  // 2. Data Fetching
  const { data: profile, isLoading, isError, error } = useUserProfile(userId, true);

  // 3. Data Normalization - Fixed the 'related' type mismatch by providing default values
  const userProfile = useMemo(() => {
    if (profile) return profile as unknown as ProfileResponse;

    if (isMe && currentUser) {
      return {
        user: currentUser,
        business: null,
        related: {
          counts: { posts: 0, followers: 0, following: 0 },
          stats: { rating: 0, reviewsCount: 0 }
        }
      } as ProfileResponse;
    }

    return null;
  }, [profile, isMe, currentUser]);

  // 4. Early Returns & Guard Clauses
  if (isLoading && !userProfile) return <DashboardSkeleton />;

  const is404 = (error as any)?.response?.status === 404;
  if (is404 || (!userProfile && !isLoading)) {
    return <Navigate to="/404" replace />;
  }

  if (isError && !userProfile) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-gray-800">Connection Error</h2>
        <p className="text-gray-500 mb-4">Please check your internet and try again.</p>
        <button onClick={() => window.location.reload()} className="bg-orange-500 text-white px-6 py-2 rounded-lg">
          Reload
        </button>
      </div>
    );
  }

  // 5. Tab Content Logic - Safe narrowing
  const renderTabContent = () => {
    if (!userProfile) return null;

    const isOwner = userProfile.user?.isBusinessOwner;

    switch (activeTab) {
      case TABS.FEEDS: return <AllFeed />;
      case TABS.POSTS: return (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <PostsFeed />
        </div>
      );
      case TABS.PRODUCTS: return isOwner ? (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <ProductsFeed />
        </div>
      ) : null;
      case TABS.ABOUT: return (
        <div className="lg:hidden">
          <ProfileAbout profile={userProfile} />
        </div>
      );
      case TABS.REVIEWS: return isOwner ? (
        <div className="bg-white rounded-xl shadow-sm border">
          <ReviewsSection />
        </div>
      ) : null;
      default: return null;
    }
  };

  // Final Guard for JSX
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
            isBusiness={userProfile.user.isBusinessOwner}
          />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;