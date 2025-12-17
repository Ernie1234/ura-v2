// src/components/feed/SocialPostCard.tsx
import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import useAuth from "@/hooks/api/use-auth";
import type { CardProps, SocialPostType } from "@/types/feed.types";
import { MediaRenderer } from "./MediaRender";
import { MediaCarousel } from "./MediaCarousel";

export default function SocialPostCard({ post, onRequireAuth }: CardProps<SocialPostType>) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    if (!isAuthenticated) return onRequireAuth?.();
    setLiked(!liked);
  };
const [isExpanded, setIsExpanded] = useState(false);
  
  // TEXT LIMIT LOGIC
  const TEXT_LIMIT = 100;
  const shouldShowReadMore = post.caption.length > TEXT_LIMIT;
  const displayText = isExpanded ? post.caption : post.caption.slice(0, TEXT_LIMIT) + "...";

  return (
    <div className="bg-white border-b border-gray-100 lg:rounded-2xl lg:border lg:mb-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4">
        <img 
          src={post.displayAvatar || "/images/default-avatar.png"} 
          className="w-10 h-10 rounded-full object-cover border" 
          alt={post.displayName} 
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-[15px]">{post.displayName}</h3>
          <p className="text-[12px] text-gray-500 -mt-0.5">
            @{post.username || 'user'} • <span className="text-[11px] font-normal">1h ago</span>
          </p>
        </div>
        <button className="text-gray-400 p-1 hover:bg-gray-50 rounded-full"><MoreVertical size={18} /></button>
      </div>

      {/* CAPTION */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 text-[14px] leading-snug">
          {shouldShowReadMore ? displayText : post.caption}
          {shouldShowReadMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-orange-600 font-bold ml-1 hover:underline"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>
      </div>

      {/* MEDIA CAROUSEL - No Scrollbar */}
        <MediaCarousel media={post.media}/>

      {/* ACTIONS BAR */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <button onClick={toggleLike} className="flex items-center gap-1.5 group">
            <Heart className={`w-6 h-6 transition ${liked ? "fill-red-500 stroke-red-500 text-red-500" : "text-gray-700 group-hover:text-red-500"}`} />
            <span className="text-xs font-bold text-gray-600">183</span>
          </button>
          <button className="flex items-center gap-1.5 group">
            <MessageCircle className="w-6 h-6 text-gray-700 group-hover:text-orange-500" />
            <span className="text-xs font-bold text-gray-600">57</span>
          </button>
          <button className="group text-gray-700 hover:text-orange-500">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <button className="group text-gray-700 hover:text-orange-500">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}