import { Loader2, RefreshCcw } from "lucide-react";
import { useFeed } from "@/hooks/api/use-feed"; 
import ProductPostCard from "./ProductPostCard";

export default function ProductsFeed({ onRequireAuth }: { onRequireAuth?: () => void }) {
  // 1. Destructure data (aliased to posts) from the hook
  // Assuming useFeed returns { data: Post[], ... }
  const { posts, isLoading, isError, refetch } = useFeed();

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-orange-500" />
        <p className="text-sm font-medium">Curating your feed...</p>
      </div>
    );
  }

  // 3. Error State
  if (isError) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto">
        <p className="text-red-600 font-medium mb-3">Couldn't load your feed.</p>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-white border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <RefreshCcw size={14} /> Try Again
        </button>
      </div>
    );
  }

  // 4. Empty State
  // We use optional chaining and check length safely
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 italic bg-white rounded-2xl border border-dashed max-w-2xl mx-auto">
        No posts in your network yet.
      </div>
    );
  }

  // 5. Success State
  return (
    <div className="grid gap-6 max-w-2xl mx-auto pb-10">
      {posts.map((post: any) => (
        <ProductPostCard 
          key={post._id} 
          post={post} 
          onRequireAuth={onRequireAuth} 
        />
      ))}
    </div>
  );
}