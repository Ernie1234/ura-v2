// src/components/dashboard/ProfileCard.tsx

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  // Provide default empty objects so TypeScript knows these are always defined
  const {
    user = {
      firstName: "",
      lastName: "",
      profilePicture: "",
      coverPicture: "",
    },
    related = {
      counts: { posts: 0, followers: 0, following: 0 },
    },
  } = useAuthContext();

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      {/* Cover */}
      <div className="relative">
        <img
          src={user.coverPicture}
          alt="Cover"
          className="h-28 w-full rounded-lg object-cover"
        />

        {/* Profile photo */}
        <img
          src={user.profilePicture}
          className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border-4 border-white shadow-md"
        />
      </div>

      <div className="mt-10 text-center">
        <h2 className="font-semibold text-lg">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">
          @{user.firstName}{user.lastName}_
        </p>

        <div className="mt-3 flex justify-around text-sm">
          <div className="text-center">
            <p className="font-bold">{related.counts.posts}</p>
            <span className="text-gray-500">Posts</span>
          </div>
          <div className="text-center">
            <p className="font-bold">{related.counts.followers}</p>
            <span className="text-gray-500">Followers</span>
          </div>
          <div className="text-center">
            <p className="font-bold">{related.counts.following}</p>
            <span className="text-gray-500">Following</span>
          </div>
        </div>

        <Button
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white w-full"
          asChild
        >
          <Link to="/dashboard/profile/12345">My Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
