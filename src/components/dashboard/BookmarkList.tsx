// src/components/dashboard/BookmarkList.tsx

import type { Bookmark } from '@/types/api.types';
import { Loader2 } from 'lucide-react';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  isLoading: boolean;
  isError: boolean;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, isLoading, isError }) => {
  
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-md text-center py-4 text-gray-500 flex justify-center items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading bookmarks…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-md text-center py-4 text-red-500 text-sm font-medium">
        Failed to load bookmarks.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Bookmarks</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">No bookmarks saved.</div>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {bookmarks.map((bm) => (
            <li key={bm.id} className="flex items-center gap-3">
              <img src={bm.avatar} alt={bm.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="font-medium text-sm">{bm.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{bm.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;