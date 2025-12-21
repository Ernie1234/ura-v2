import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, RefreshCcw, ShoppingBag, ArrowUp } from "lucide-react";
import { useInfiniteFeed, useProductsFeed } from "@/hooks/api/use-feed"; 
import { useAuthContext } from "@/context/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProductPostCard from "./ProductPostCard"; // Optimized for product data

interface ProductsFeedProps {
  targetId?: string; // Business ID or User ID
  onRequireAuth?: () => void;
}

export default function ProductsFeed({ targetId, onRequireAuth }: ProductsFeedProps) {
  const { user: currentUser } = useAuthContext();
  
  // Logic: Use the profile being viewed, otherwise fallback to logged-in user
  const effectiveId = targetId || currentUser?._id;

  // Fetch only 'PRODUCT' type for this specific ID
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isRefetching,
  } = useProductsFeed(effectiveId, true); 

  const [showScrollTop, setShowScrollTop] = useState(false);
  const { ref: bottomRef, inView: isBottomInView } = useInView();

  // Scroll Tracking for Internal Container
  useEffect(() => {
    const container = document.getElementById("main-feed-container");
    const handleScroll = () => {
      if (container) setShowScrollTop(container.scrollTop > 400);
    };
    if (container) container.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (isBottomInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomInView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const scrollToTop = () => {
    const container = document.getElementById("main-feed-container");
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-orange-500" />
        <p className="text-sm font-medium">Loading catalog...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-10 bg-orange-50/30 rounded-2xl border border-orange-100">
        <p className="text-orange-800 font-medium mb-3">Failed to load products.</p>
        <Button onClick={() => refetch()} variant="outline" className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50">
          <RefreshCcw size={14} className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page) || [];

  if (allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-dashed rounded-[32px] border-gray-100">
        <div className="bg-orange-50 p-4 rounded-full mb-3">
          <ShoppingBag className="w-8 h-8 text-orange-300" />
        </div>
        <h3 className="text-base font-bold text-gray-900">No products listed</h3>
        <p className="text-gray-400 text-xs max-w-[200px]">
          {targetId === currentUser?._id 
            ? "You haven't added any products to your business yet." 
            : "This business hasn't listed any items for sale."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6">
      {/* Refetching State */}
      {isRefetching && !isFetchingNextPage && (
        <div className="flex justify-center sticky top-0 z-10">
          <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 shadow-lg tracking-wider">
            <RefreshCcw size={10} className="animate-spin" /> UPDATING CATALOG
          </div>
        </div>
      )}

      {/* Product List - Using a slightly different gap for items */}
      <div className="grid gap-8">
        {allProducts.map((product) => (
          <ProductPostCard 
            key={product._id} 
            post={product} 
            onRequireAuth={onRequireAuth} 
          />
        ))}
      </div>

      {/* Loading Sentinel */}
      <div ref={bottomRef} className="py-12 text-center">
        {isFetchingNextPage ? (
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
        ) : !hasNextPage ? (
          <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-2">
            <ShoppingBag size={16} className="text-gray-200" />
            <p className="text-gray-300 text-[10px] font-black tracking-[0.2em] uppercase">
              End of Catalog
            </p>
          </div>
        ) : null}
      </div>

      {/* Floating Scroll Top (Shared ID logic) */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-10 right-10 p-4 bg-gray-900 text-white rounded-full shadow-2xl transition-all duration-500 z-50 hover:bg-orange-600",
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <ArrowUp size={20} strokeWidth={3} />
      </button>
    </div>
  );
}