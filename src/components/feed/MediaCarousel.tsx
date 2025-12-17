// src/components/feed/MediaCarousel.tsx
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";

export const MediaCarousel = ({ media }: { media: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(1);
  const [showArrows, setShowArrows] = useState(false);
  
  // FIX: Use 'any' or 'number' to avoid NodeJS namespace error in Browser
  const timerRef = useRef<any>(null); 

  const handleMouseMove = () => {
    setShowArrows(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowArrows(false);
    }, 2500);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -width : width, 
        behavior: 'smooth' 
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth) + 1;
      setIndex(idx);
    }
  };

  return (
    <div 
      className="relative w-full aspect-square bg-gray-50 overflow-hidden lg:rounded-xl group/carousel"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scrollbar-hide"
      >
        {media.map((url, i) => {
          const isVideo = url.match(/\.(mp4|webm|mov|m4v)$/i);
          return (
            <div key={i} className="flex-shrink-0 w-full h-full snap-center">
              {isVideo ? (
                <VideoPlayer url={url} className="w-full h-full object-cover" />
              ) : (
                <img src={url} className="w-full h-full object-cover" alt="" />
              )}
            </div>
          );
        })}
      </div>

      {media.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('left'); }} 
            className={`hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-xl hover:bg-white transition-opacity duration-300 z-50 ${showArrows ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={22} className="text-gray-900" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('right'); }} 
            className={`hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-xl hover:bg-white transition-opacity duration-300 z-50 ${showArrows ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={22} className="text-gray-900" />
          </button>

          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-50">
            {index} / {media.length}
          </div>
        </>
      )}
    </div>
  );
};