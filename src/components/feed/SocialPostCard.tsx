// src/components/feed/SocialPostCard.tsx

import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import type { CardProps, SocialPostType } from "@/types/feed.types"; // Adjust import path if needed
import { MediaRenderer } from "./MediaRender";

export default function SocialPostCard({ post, onRequireAuth }: CardProps<SocialPostType>) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    if (!isAuthenticated) return onRequireAuth?.();
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4">
        <img src={post.displayAvatar || "/images/default-avatar.png"} className="w-10 h-10 rounded-full object-cover border" alt={post.displayName} />
        <div className="flex-1 leading-tight">
          <h3 className="font-semibold text-gray-900">{post.displayName}</h3>
          <p className="text-xs text-gray-500">@{post.author?.username}</p>
        </div>
        <button onClick={onRequireAuth} className="text-xs font-bold bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-200 transition">
          Follow
        </button>
      </div>

      {/* MEDIA GRID */}
      <div className="relative aspect-square bg-gray-100 flex overflow-x-auto snap-x snap-mandatory">
        {post.media.map((url: string, index: number) => (
          <div key={index} className="flex-shrink-0 w-full h-full snap-center">
            <MediaRenderer 
              url={url} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
        
        {/* Indicator if more than 1 item */}
        {post.media.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            1 / {post.media.length}
          </div>
        )}
      </div>


      {/* CAPTION */}
      <div className="px-4 py-3">
        <p className="text-gray-800 text-[15px] whitespace-pre-wrap">{post.caption}</p>
        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-orange-500 text-xs font-medium">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        <div className="flex items-center gap-6">
          <button onClick={toggleLike} className="group flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
            <Heart className={`w-5 h-5 transition ${liked ? "fill-red-500 stroke-red-500" : "group-hover:stroke-red-500"}`} />
          </button>
          <button onClick={onRequireAuth} className="text-gray-500 hover:text-orange-500 transition"><MessageCircle className="w-5 h-5" /></button>
          <button onClick={onRequireAuth} className="text-gray-500 hover:text-orange-500 transition"><Share2 className="w-5 h-5" /></button>
        </div>
        <button onClick={onRequireAuth} className="text-gray-500 hover:text-orange-500 transition"><Bookmark className="w-5 h-5" /></button>
      </div>
    </div>
  );
}