// src/components/profile/ProfileHeader.tsx
import { generateAvatarUrl } from "@/utils/avatar-generator";
import React from "react";
type Props = {
  profile: any;
};

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  const FALLBACK_PROFILE_URL = generateAvatarUrl(profile.user.username);

  return (
    <header className="bg-white rounded-xl shadow-sm">
      {/* Banner */}
      <div className="relative">
        <img
          src={profile?.user?.coverPicture ?? "/images/default-cover.jpg"}
          alt="cover"
          className="w-full h-44 md:h-56 object-cover rounded-t-xl"
        />

        {/* circular avatar */}
        <div className="absolute left-12 -bottom-12">
          <img
            src={profile.user.profilePicture ?? FALLBACK_PROFILE_URL}
            alt="avatar"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow"
          />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
