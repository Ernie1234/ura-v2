import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";
import { formatDistanceToNow } from "date-fns";

interface Chat {
  name: string;
  message: string;
  date: string; // ISO string
  avatar: string;
}

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.get("chats")
      .then((data: { chats: Chat[] }) => {
        setChats(data.chats ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load chats:", err);
        setChats([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading chats…</div>;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Chats</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {chats.map((chat, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={chat.avatar} alt={chat.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-medium text-sm">{chat.name}</p>
                <p className="text-xs text-gray-500">{chat.message}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(chat.date), { addSuffix: true })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
