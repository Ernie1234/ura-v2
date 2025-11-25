// src/components/dashboard/BookmarkList.tsx
interface Bookmark {
  name: string;
  description: string;
  avatar: string;
}

const bookmarks: Bookmark[] = [
  {
    name: 'Frank Smith',
    description: 'Business update message',
    avatar: '/images/avatar-male.png',
  },
  { name: 'Tom Royal', description: 'Access my source code', avatar: '/images/avatar-male.png' },
  { name: 'Jane Cloe', description: 'Preview next project', avatar: '/images/avatar-female.png' },
];

const BookmarkList = () => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Bookmark</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      <ul className="space-y-4">
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
