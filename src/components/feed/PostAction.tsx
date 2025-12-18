// src/components/feed/PostActions.tsx
import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, CommandIcon } from "lucide-react";
// src/components/feed/PostActions.tsx
import API from "@/lib/axios-client"; // Assuming your axios instance
import { CommentDrawer } from "./CommentDrawer";

interface PostActionsProps {
  postId: string;
  user_image: URL;
  initialLikes?: number;
  initialComments?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onRequireAuth?: () => void;
  isAuthenticated: boolean;
}



export const PostActions = ({
  postId,
  user_image,
  initialLikes = 0,
  initialComments = 0,
  isLiked = false,
  isBookmarked = false,
  onRequireAuth,
  isAuthenticated
}: PostActionsProps) => {
  const handleShare = async () => {
  const shareData = {
    title: 'Check out this post!',
    text: 'I found this interesting post on the app.',
    url: `${window.location.origin}/posts/${postId}`, // Adjust this to your actual routing
  };

  try {
    // Try native sharing first (works on mobile/Safari)
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!'); 
      // Replace alert with a toast notification if you have one
    }
  } catch (err) {
    console.error('Error sharing:', err);
  }
};

  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const handleLike = async () => {
    if (!isAuthenticated) return onRequireAuth?.();

    // Optimistic Update
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    try {
      await API.post(`/post/${postId}/like`);
    } catch (error) {
      // Revert if API fails
      setLiked(liked);
      setLikesCount(likesCount);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return onRequireAuth?.();

    setBookmarked(!bookmarked);

    try {
      await API.post(`/bookmark/toggle/${postId}`, { targetType: 'Post' });
    } catch (error) {
      setBookmarked(bookmarked);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <button onClick={handleLike} className="flex items-center gap-1.5 group">
          <Heart className={`w-6 h-6 transition-all ${liked ? "fill-red-500 text-red-500" : "text-gray-700 group-hover:text-red-500"}`} />
          <span className="text-xs font-bold text-gray-600">{likesCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setIsCommentOpen(true)}
          className="flex items-center gap-1.5 group">
          <MessageCircle className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors" />
          <span className="text-xs font-bold text-gray-600">{initialComments}</span>
        </button>
        <CommentDrawer
          isOpen={isCommentOpen}
          onClose={setIsCommentOpen}
          postId={postId}
          user_image={user_image}
          
        />

        {/* Share Button */}
{/* Share Button */}
<button 
  onClick={handleShare}
  className="group flex items-center gap-1.5 text-gray-700 hover:text-orange-500 transition-all active:scale-90"
  title="Share Post"
>
  <div className="p-2 group-hover:bg-orange-50 rounded-full transition-colors">
    <Share2 className="w-6 h-6" />
  </div>
  {/* Optional: Add a share count if your backend supports it */}
  {/* <span className="text-xs font-bold text-gray-500 group-hover:text-orange-500">
    Share
  </span> */}
</button>
      </div>

      {/* Bookmark Button */}
      <button onClick={handleBookmark}>
        <Bookmark className={`w-6 h-6 transition-colors ${bookmarked ? "fill-orange-500 text-orange-500" : "text-gray-700 hover:text-orange-500"}`} />
      </button>
    </div>
  );
};



