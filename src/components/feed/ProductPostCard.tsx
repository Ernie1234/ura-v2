// src/components/feed/ProductPostCard.tsx

import { useState } from "react";
import { Bookmark, Heart, Share2, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import type { CardProps, ProductPostType } from "@/types/feed.types"; // Adjust import path

export default function ProductPostCard({ post, onRequireAuth }: CardProps<ProductPostType>) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    if (!isAuthenticated) return onRequireAuth?.();
    setLiked(!liked);
  };

  // Format price currency
  const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(post.price);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden hover:shadow-lg transition-all animate-fadeIn relative">
        {/* Product Badge */}
        <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md z-10 flex items-center gap-1">
            <ShoppingBag size={12} /> Product
        </div>

      {/* HEADER (Business focused) */}
      <div className="flex items-center gap-3 p-4">
        <img src={post.displayAvatar || "/images/default-avatar.png"} className="w-12 h-12 rounded-full object-cover border-2 border-orange-50" alt={post.displayName} />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{post.displayName}</h3>
           {/* Rating - Assuming businesses have ratings */}
           <div className="flex items-center text-yellow-400 text-xs mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < (post.author?.rating ?? 4) ? "fill-yellow-400" : "fill-gray-200 stroke-gray-200"} />
              ))}
              <span className="text-gray-400 ml-1">({post.author?.rating ?? 4}.0)</span>
            </div>
        </div>
      </div>

      {/* MEDIA SHOWCASE (Larger for products) */}
      {post.media && post.media[0] && (
        <div className="px-4 pb-4">
            <img src={post.media[0]} className="rounded-2xl w-full h-[350px] object-cover shadow-sm" alt={post.productName} />
        </div>
      )}

      {/* PRODUCT DETAILS & PRICE */}
      <div className="px-5 pb-4">
        <div className="flex justify-between items-start mb-2">
             <h2 className="text-xl font-bold text-gray-900 leading-tight max-w-[70%]">{post.productName}</h2>
             <p className="text-orange-600 font-extrabold text-xl bg-orange-50 px-2 py-1 rounded-lg">{formattedPrice}</p>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.caption}</p>

        {/* CALL TO ACTION FOOTER */}
        <div className="flex items-center gap-3 mt-4">
            <Link
            to={`/business/${post.author._id}/product/${post._id}`} // Example route
            className="flex-1 text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2"
            >
             <ShoppingBag size={18} /> View Product Details
            </Link>
            <button onClick={toggleLike} className="p-3 bg-gray-100 rounded-xl hover:bg-red-50 transition group">
                <Heart className={`w-6 h-6 ${liked ? "fill-red-500 stroke-red-500" : "stroke-gray-500 group-hover:stroke-red-500"}`} />
            </button>
        </div>
      </div>
    </div>
  );
}