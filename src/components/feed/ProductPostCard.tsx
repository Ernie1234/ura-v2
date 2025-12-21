// src/components/feed/ProductPostCard.tsx
import { useState } from "react";
import { Bookmark, Heart, Share2, Star, ShoppingBag, CheckCircle2, MessageCircle } from "lucide-react";
import useAuth from "@/hooks/api/use-auth";
import type { CardProps, ProductPostType } from "@/types/feed.types";
import { MediaCarousel } from "./MediaCarousel";
import { PostActions } from "./PostAction";
import { generateAvatarUrl } from "@/utils/avatar-generator";
import { Link } from "react-router-dom";

export default function ProductPostCard({ post, onRequireAuth }: CardProps<ProductPostType>) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    if (!isAuthenticated) return onRequireAuth?.();
    setLiked(!liked);
  };

  const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(post.price);

    const user_image = post.displayAvatar || generateAvatarUrl(post.displayName);
  
  // Rating Logic: Create an array of 5 for the stars
  const ratingValue = post.rating || 0;
  const [isExpanded, setIsExpanded] = useState(false);

  // TEXT LIMIT LOGIC
  const TEXT_LIMIT = 100;
  const shouldShowReadMore = post.caption.length > TEXT_LIMIT;
  const displayText = isExpanded ? post.caption : post.caption.slice(0, TEXT_LIMIT) + "...";

  return (
    <div className="bg-white border-b border-gray-100 lg:rounded-2xl lg:border lg:mb-6 lg:shadow-sm relative animate-fadeIn">
      {/* PRODUCT BADGE - Moved slightly higher/smaller for mobile */}
      <div className="absolute top-3 right-3 bg-orange-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded z-20 flex items-center gap-1 shadow-sm">
        <ShoppingBag size={10} /> PRODUCT
      </div>

      {/* HEADER - Fixed Overlap */}
      <div className="flex items-center gap-3 p-4 pr-20"> {/* Added pr-20 to clear space for badge */}
        <img src={post.displayAvatar || "/images/default-avatar.png"} className="w-10 h-10 rounded-full object-cover border" alt="" />
        <div className="min-w-0 flex-1"> {/* min-w-0 allows truncation to work */}
          <div className="flex items-center gap-1">
          <Link to={`/dashboard/profile/business/${post.authorId}`}>
            <h3 className="font-bold text-gray-900 text-[15px] truncate">{post.displayName}</h3>
          </Link>
            {post.isVerified && <CheckCircle2 size={14} className="fill-blue-500 text-white flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={10} className={s <= (post.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-gray-200"} />
            ))}
          </div>
        </div>
      </div>

      {/* CAPTION with Read More */}
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

      <MediaCarousel media={post.media} />

      {/* PRICE & BUTTONS */}
      <div className="px-4 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 leading-tight">{post.productName}</h2>
            <p className="text-orange-600 font-black text-[18px]">{formattedPrice}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition">
              Details
            </button>
            <button className="flex-1 sm:flex-none bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition flex items-center justify-center gap-1">
              <ShoppingBag size={14} /> Buy
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <PostActions
        postId={post._id}
        user_image={user_image}
        isAuthenticated={isAuthenticated}
        onRequireAuth={onRequireAuth}
        initialLikes={post.likesCount || 0}
        initialComments={post.commentsCount || 0}
        isLiked={post.isLiked}
        isBookmarked={post.isBookmarked}
      />
    </div>
  );
}