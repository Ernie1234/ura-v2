import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generateAvatarUrl } from '@/utils/avatar-generator';
import type { UserType, RelatedData } from '@/types/api.types';

interface ProfileCardProps {
  user: UserType;
  related: RelatedData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, related }) => {
 
  const FALLBACK_PROFILE_URL = generateAvatarUrl(`${user.firstName} ${user.lastName}`);

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
          src={user.profilePicture ?? FALLBACK_PROFILE_URL}

          className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border-4 border-white shadow-md"
        />
      </div>

      <div className="mt-10 text-center">
        <h2 className="font-semibold text-lg">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">
          @{user.username}
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
          <Link to={`/dashboard/profile/user/${user._id}`}>My Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
