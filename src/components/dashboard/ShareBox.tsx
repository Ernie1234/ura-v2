import { ImageIcon, Video, Tag, Globe, SendHorizonal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvatarCard } from '../shared/AvatarCard';
import { useAuthContext } from '@/context/auth-provider';

const ShareBox = () => {
  const { isLoading, user } = useAuthContext();

  if (isLoading || !user) {
    return <div className="p-4 text-gray-400 text-sm">Loading...</div>;
  }

  const initials = `${user.firstName?.[0] ?? 'U'}${user.lastName?.[0] ?? ''}`;

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-start gap-3">
        <AvatarCard
          fallbackText={initials}
          image={user.profilePicture}
          link="/dashboard/profile"
          key={user._id}
        />

        <div className="flex-1">
          <Input
            placeholder="Share something..."
            className="rounded-full bg-[#FFF3E8] border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-5 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <ImageIcon size={16} /> Image
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <Video size={16} /> Video
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <Tag size={16} /> Tag
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <Globe size={16} /> Public
              </button>
            </div>

            <Button size="icon" className="rounded-full bg-orange-500 hover:bg-orange-600">
              <SendHorizonal size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareBox;
