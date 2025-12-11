// src/pages/dashboard/profile/[userId].tsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";
import { useUserProfile } from "@/hooks/api/use-user-profile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfilePostsFeed from "@/components/profile/ProfilePostsFeed";
import ProfileInfo from "@/components/profile/ProfileInfo";

const UserProfilePage: React.FC = () => {
  const { user: currentUser } = useAuthContext();
  const { userId } = useParams<{ userId: string }>();

  // If userId missing, fallback to current user's id
  const id = userId ?? currentUser?._id;

  const { data, isLoading } = useUserProfile(id || null);

  const profile = data ?? null;

  const [activeTab, setActiveTab] = useState("All Posts");

  // detect ownership
  const isMe = useMemo(() => {
    return currentUser && profile && currentUser._id === profile.user?._id;
  }, [currentUser, profile]);

  if (isLoading) return <div className="p-6">Loading profile…</div>;
  if (!profile) return <div className="p-6">Profile not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Info Column */}
        <ProfileInfo profile={profile}/>
        {/* Main column */}
        <main className="lg:col-span-2 space-y-6">
          <ProfileTabs active={activeTab} onChange={setActiveTab} />

          <div className="space-y-6 lg:col-span-2 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto">
            {activeTab === "All Posts" && <ProfilePostsFeed profile={profile} />}
            {activeTab === "About" && <ProfileAbout profile={profile} />}
            {activeTab === "Products" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">Products section (mock)</div>
            )}
            {activeTab === "Reviews" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">Reviews section (mock)</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
