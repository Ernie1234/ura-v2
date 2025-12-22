import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import API from "@/lib/axios-client";
import { CommentDrawer } from "./CommentDrawer";
import { useToggleLike, useToggleBookmark } from "@/hooks/api/use-feed";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PostActionsProps {
  postId: string;
  user_image: string;
  initialLikes?: number;
  initialComments?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
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
  // 1. Local states for INSTANT reflection
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(initialLikes);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const { mutate: toggleLike } = useToggleLike(postId, 'post');
  const { mutate: toggleBookmark } = useToggleBookmark(postId, 'Post');

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return onRequireAuth?.();

    // --- INSTANT UI CHANGE ---
    const wasLiked = localIsLiked;
    setLocalIsLiked(!wasLiked);
    setLocalLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    // --- BACKEND CALL ---
    toggleLike(undefined, {
      onError: () => {
        // REVERT if backend fails
        setLocalIsLiked(wasLiked);
        setLocalLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      }
      // If success, we do nothing. The UI is already correct.
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return onRequireAuth?.();

    // --- INSTANT UI CHANGE ---
    const wasBookmarked = localIsBookmarked;
    setLocalIsBookmarked(!wasBookmarked);

    // --- BACKEND CALL ---
    toggleBookmark(undefined, {
      onError: () => {
        // REVERT if backend fails
        setLocalIsBookmarked(wasBookmarked);
      }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this post!',
      text: 'I found this interesting post on the app.',
      url: `${window.location.origin}/posts/${postId}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // --- RENDER ---
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <button onClick={handleLike} className="flex items-center gap-1.5 group outline-none">
          <motion.div
            key={localIsLiked ? "liked" : "unliked"}
            animate={{ scale: localIsLiked ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-colors duration-200",
                localIsLiked ? "fill-red-500 text-red-500" : "text-gray-700"
              )}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.span
              key={localLikesCount}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="text-xs font-black text-gray-700"
            >
              {localLikesCount}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setIsCommentOpen(true)}
          className="flex items-center gap-1.5 group"
        >
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
        <button
          onClick={handleShare}
          className="group flex items-center gap-1.5 text-gray-700 hover:text-orange-500 transition-all active:scale-90"
        >
          <div className="p-2 group-hover:bg-orange-50 rounded-full transition-colors">
            <Share2 className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* Bookmark Button */}
      <button onClick={handleBookmark} className="p-2 -mr-2 outline-none group">
        <motion.div animate={{ scale: localIsBookmarked ? [1, 1.2, 1] : 1 }}>
          <Bookmark
            className={cn(
              "w-6 h-6 transition-colors duration-200",
              localIsBookmarked ? "fill-orange-500 text-orange-500" : "text-gray-700 hover:text-orange-400"
            )}
          />
        </motion.div>
      </button>
    </div>
  );
};