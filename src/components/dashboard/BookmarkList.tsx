import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";

interface Bookmark {
  name: string;
  description: string;
  avatar: string;
}

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.get("bookmarks")
      .then((data: { bookmarks: Bookmark[] }) => {
        setBookmarks(data.bookmarks ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load bookmarks:", err);
        setBookmarks([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading bookmarks…</div>;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Bookmarks</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      <ul className="space-y-4 max-h-64 overflow-y-auto">
        {bookmarks.map((bm, i) => (
          <li key={i} className="flex items-center gap-3">
            <img src={bm.avatar} alt={bm.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-medium text-sm">{bm.name}</p>
              <p className="text-xs text-gray-500">{bm.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarkList;
