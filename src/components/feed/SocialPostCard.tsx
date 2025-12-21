// src/components/feed/SocialPostCard.tsx
import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import useAuth from "@/hooks/api/use-auth";
import type { CardProps, SocialPostType } from "@/types/feed.types";
import { MediaCarousel } from "./MediaCarousel";
import { generateAvatarUrl } from "@/utils/avatar-generator";
import { PostActions } from "./PostAction";
import { Link } from "react-router-dom";
import { formatTimeAgo } from '@/utils/date-format';

import { PostMenu } from "./PostMenu";
import { Link2, Flag, UserMinus, Trash2, BellOff } from "lucide-react";
import { toast } from "sonner"; // Assuming you use Sonner for notifications
import { useAuthContext } from "@/context/auth-provider";

export default function SocialPostCard({ post, onRequireAuth }: CardProps<SocialPostType>) {
  const { user, isAuthenticated } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const isOwner = post.authorId === user?._id;

  const menuActions = [
    {
      label: "Copy Link",
      icon: Link2,
      onClick: () => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        toast.success("Link copied to clipboard!");
      }
    },
    {
      label: "Mute Notifications",
      icon: BellOff,
      onClick: () => console.log("Muted"),
      show: isOwner // Only show if owner
    },
    {
      label: "Unfollow User",
      icon: UserMinus,
      onClick: () => console.log("Unfollowed"),
      show: !isOwner // Only show if NOT owner
    },
    {
      label: "Report Post",
      icon: Flag,
      variant: 'danger' as const,
      onClick: () => console.log("Reported"),
      show: !isOwner
    },
    {
      label: "Delete Post",
      icon: Trash2,
      variant: 'danger' as const,
      onClick: () => console.log("Deleted"),
      show: isOwner
    }
  ];


  // TEXT LIMIT LOGIC
  const TEXT_LIMIT = 100;
  const shouldShowReadMore = post.caption.length > TEXT_LIMIT;
  const displayText = isExpanded ? post.caption : post.caption.slice(0, TEXT_LIMIT) + "...";
  const user_image = post.displayAvatar || generateAvatarUrl(post.displayName);

  return (
    <div className="bg-white border-b border-gray-100 lg:rounded-2xl lg:border lg:mb-6 animate-fadeIn overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={user_image}
          className="w-10 h-10 rounded-full object-cover border"
          alt={post.displayName}
        />
        <div className="flex-1">
          <Link to={`/dashboard/profile/user/${post.authorId}`}>

            <h3 className="font-bold text-gray-900 text-[15px]">{post.displayName}</h3>
            <p className="text-[12px] text-gray-500 -mt-0.5">
              @{post.username || ''} • <span className="text-[11px] font-normal">{formatTimeAgo(post.createdAt)}</span>
            </p>
          </Link>
        </div>
        {/* <MoreVertical size={18} /> */}
        <PostMenu actions={menuActions} />
      </div>

      {/* CAPTION */}
      <div className="px-4 pb-2">
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

      {/* 🚨 TAGS SECTION - Added here */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-[13px] font-medium text-orange-600 hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 🚨 MEDIA CAROUSEL - Conditional check fixed to prevent empty space */}
      {post.media && post.media.length > 0 ? (
        <div className="w-full">
          <MediaCarousel media={post.media} />
        </div>
      ) : null}

      {/* ACTIONS BAR */}
      {/* ACTIONS */}
      <PostActions
        postId={post._id}
        user_image={user_image}
        isAuthenticated={isAuthenticated}
        onRequireAuth={onRequireAuth}
        initialLikes={post.likesCount} // This comes directly from React Query
        isLiked={post.isLiked}         // This comes directly from React Query
        initialComments={post.commentsCount}
        isBookmarked={post.isBookmarked}
      />
    </div>
  );
}