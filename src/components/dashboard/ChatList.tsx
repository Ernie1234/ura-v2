// src/components/dashboard/ChatList.tsx
const chats = [
  { name: 'Janet Doe', message: 'I want to place a reservation', date: 'Aug 14, 2025' },
  { name: 'Janet Doe', message: 'I want to place a reservation', date: 'Aug 14, 2025' },
  { name: 'Janet Doe', message: 'I want to place a reservation', date: 'Aug 14, 2025' },
];

const ChatList = () => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <h3 className="font-semibold mb-3">Chats</h3>
      <ul className="space-y-3">
        {chats.map((chat, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/images/avatar-female.png" alt="avatar" className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-medium text-sm">{chat.name}</p>
                <p className="text-xs text-gray-500">{chat.message}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{chat.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
