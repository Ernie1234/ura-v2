// src/components/dashboard/ShareBox.tsx (REVISED)

import { ImageIcon, Video, Tag, Globe, SendHorizonal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvatarCard } from '../shared/AvatarCard';
import { useAuthContext } from '@/context/auth-provider';
// Assuming this utility function is globally available or imported elsewhere
import { generateAvatarUrl } from '@/utils/avatar-generator'; 

// NOTE: Define the FALLBACK_PROFILE_URL generation function
// const generateAvatarUrl = (username: string) => 
//     `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=40`; 

const ShareBox = () => {
    const { isLoading, user } = useAuthContext();

    if (isLoading || !user) {
        return <div className="p-4 text-gray-400 text-sm">Loading...</div>;
    }

    const initials = `${user.firstName?.[0] ?? 'U'}${user.lastName?.[0] ?? ''}`;
    
    // 🚨 NEW LOGIC: Determine the final avatar source
    const fallbackUrl = generateAvatarUrl(user.username ?? initials);
    const avatarSource = user.profilePicture ?? fallbackUrl;


    return (
        <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="flex items-start gap-3">
                <AvatarCard
                    // 🚨 Using the derived avatarSource
                    image={avatarSource} 
                    fallbackText={user.username ? user.username.charAt(0).toUpperCase() : initials}
                    link="/dashboard/profile"
                    key={user._id}
                />

                <div className="flex-1 space-y-3">
                    {/* 🚨 REVISION 1: Input and Send Button on the same line */}
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Share something..."
                            className="flex-1 rounded-full bg-[#FFF3E8] border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                        />
                        <Button 
                            size="icon" 
                            className="rounded-full bg-orange-500 hover:bg-orange-600 h-10 w-10 shrink-0"
                            aria-label="Send Post"
                        >
                            <SendHorizonal size={16} />
                        </Button>
                    </div>

                    {/* 🚨 REVISION 2: Action buttons moved below the input line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                        <div className="flex items-center gap-3 md:gap-5 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                                <ImageIcon size={16} /> <span className="hidden sm:inline">Image</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                                <Video size={16} /> <span className="hidden sm:inline">Video</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                                <Tag size={16} /> <span className="hidden sm:inline">Tag</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                                <Globe size={16} /> <span className="hidden sm:inline">Public</span>
                            </button>
                        </div>
                        {/* Send button removed from here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareBox;