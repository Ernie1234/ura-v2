// src/pages/dashboard/ChatsPage.tsx
import { useState } from 'react';
import { Search, Plus, Send, Smile, Mic, Camera, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Dummy Data
const DUMMY_CHATS = [
  { id: '1', name: 'John Joe', lastMsg: 'I will like to place a reservation', time: 'Aug 14, 2025', avatar: '/path/to/avatar1.jpg' },
  { id: '2', name: 'Janet Doe', lastMsg: 'I will like to place a reservation', time: 'Aug 14, 2025', avatar: '/path/to/avatar2.jpg' },
  { id: '3', name: 'Daniel Alfred', lastMsg: 'I want 10 pieces of this item', time: 'Jul 14, 2025', avatar: '/path/to/avatar3.jpg' },
];

export const ChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState(DUMMY_CHATS[0]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* Left Sidebar: Chat List */}
      <div className="w-full md:w-[400px] border-r border-gray-100 flex flex-col">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus size={24} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search chats and messages" 
              className="pl-10 bg-gray-50 border-none rounded-full"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {DUMMY_CHATS.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                selectedChat.id === chat.id ? 'bg-orange-50/50' : 'hover:bg-gray-50'
              }`}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-orange-100 text-orange-600">{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 border-b border-gray-50 pb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMsg}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right Section: Active Chat */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-gray-900">{selectedChat.name}</h2>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon"><MoreVertical size={20} /></Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6 space-y-6">
               <div className="flex flex-col gap-4">
                  {/* Incoming */}
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-auto"><AvatarImage src={selectedChat.avatar} /></Avatar>
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none text-sm text-gray-800">
                      Hello {selectedChat.name.split(' ')[0]}, how can I help you today?
                    </div>
                  </div>
                  {/* Outgoing */}
                  <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="bg-orange-600 p-4 rounded-2xl rounded-br-none text-sm text-white">
                      Hi! I want to inquire about the Jollof Rice delivery.
                    </div>
                  </div>
               </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                <Button variant="ghost" size="icon" className="text-gray-400"><Camera size={20} /></Button>
                <Button variant="ghost" size="icon" className="text-gray-400"><Mic size={20} /></Button>
                <Input 
                  placeholder="Type a message..." 
                  className="border-none bg-transparent focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon" className="text-gray-400"><Smile size={20} /></Button>
                <Button className="bg-orange-600 hover:bg-orange-700 rounded-full h-10 w-10 p-0 shadow-lg">
                  <Send size={18} className="text-white ml-0.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <div className="w-64 h-64 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <img src="/path/to/chat-illustration.png" alt="Select Chat" className="w-48" />
             </div>
             <h2 className="text-xl font-bold text-gray-900">Your Messages</h2>
             <p className="text-gray-500 max-w-sm mt-2">
               Get started on real conversations, quick support, and exciting collaboration with customers.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};