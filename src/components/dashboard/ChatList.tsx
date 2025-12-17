// src/components/ChatList.tsx (Presentational Component - Final Version)

import { formatDistanceToNow } from 'date-fns';
import type { Chat } from '@/types/api.types'; // Import the type from the hook

interface ChatListProps {
  chatList: Chat[];
  isError: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ chatList, isError }) => {
  // NOTE: Loading and Error states are handled by the component using this component.
  // 1. Handle the error state first
  if (isError) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-md text-center">
        <div className="text-red-500 font-medium">
          Could not load chats.
        </div>
        <p className="text-sm text-gray-500 mt-1">Please try refreshing the page.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Chats</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      {chatList.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">No active conversations.</div>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {chatList.map((chat) => (
            <li
              key={chat.id}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer ${chat.isUnread ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
            >
              {/* ... Chat content rendering remains the same ... */}
              <div className="flex items-center gap-3">
                <img src={chat.avatar} alt={chat.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className={`font-medium text-sm ${chat.isUnread ? 'text-black' : 'text-gray-900'}`}>{chat.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-40">{chat.message}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">
                  {formatDistanceToNow(new Date(chat.date), { addSuffix: true })}
                </span>
                {chat.isUnread && (
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-500 mt-1"></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;