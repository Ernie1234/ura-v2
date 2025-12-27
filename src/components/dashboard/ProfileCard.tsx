import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generateAvatarUrl } from '@/utils/avatar-generator';
import type { UserType, RelatedData } from '@/types/api.types';
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  user: UserType;
  related: RelatedData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, related }) => {
  const FALLBACK_PROFILE_URL = generateAvatarUrl(`${user.firstName} ${user.lastName}`);

  return (
    /* GLASS CONTAINER: white/40 opacity + heavy blur + precise border */
    <div className="rounded-[28px] bg-white/40 backdrop-blur-xl p-3 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

      {/* Cover Section */}
      <div className="relative">
        <img
          src={user.coverPicture || '/default-cover.jpg'}
          alt="Cover"
          className="h-24 w-full rounded-[20px] object-cover bg-gray-100"
        />

        {/* Profile photo: Adjusted positioning and ring for glass effect */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
          <img
            src={user.profilePicture ?? FALLBACK_PROFILE_URL}
            className="h-20 w-20 rounded-full border-[4px] border-white/80 shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="mt-12 text-center px-2">
        {/* Typography: Urbanist bold for names */}
        <h2 className="font-bold text-[17px] text-gray-900 tracking-tight leading-tight">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-[12px] font-medium text-gray-400 mt-0.5 tracking-wide">
          @{user.username}
        </p>

        {/* Stats Section: Using your orange for counts */}
        <div className="mt-6 flex justify-between px-2">
          {[
            { label: 'Posts', count: related.counts.posts },
            { label: 'Followers', count: related.counts.followers },
            { label: 'Following', count: related.counts.following }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="font-black text-[15px] text-gray-900 leading-none mb-1.5">
                {stat.count}
              </p>
              <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-gray-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action: Custom Button Style */}
        <Button
          className="mt-6 bg-gray-950 hover:bg-black text-white w-full rounded-2xl h-11 text-sm font-bold shadow-lg shadow-gray-200 transition-all active:scale-[0.98] cursor-pointer"
          asChild
        >
          <Link to={`/dashboard/profile/user/${user._id}`}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;