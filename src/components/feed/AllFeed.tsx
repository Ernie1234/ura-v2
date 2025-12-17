import { Loader2, RefreshCcw } from "lucide-react";
import { useFeed } from "@/hooks/api/use-feed"; // Our new hook
import SocialPostCard from "./SocialPostCard";
import ProductPostCard from "./ProductPostCard";

export default function PostFeed({ onRequireAuth }: { onRequireAuth?: () => void }) {
  // 🚀 Logic is now a single line
  const { posts, isLoading, isError, refetch } = useFeed();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm font-medium">Curating your feed...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-500 font-medium mb-3">Couldn't load your feed.</p>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
        >
          <RefreshCcw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-2xl mx-auto pb-10">
      {posts.map((post) => (
        post.type === 'PRODUCT' 
          ? <ProductPostCard key={post._id} post={post} onRequireAuth={onRequireAuth} />
          : <SocialPostCard key={post._id} post={post} onRequireAuth={onRequireAuth} />
      ))}
      
      {posts.length === 0 && (
        <div className="text-center py-20 text-gray-500 italic">
          No posts in your network yet.
        </div>
      )}
    </div>
  );
}