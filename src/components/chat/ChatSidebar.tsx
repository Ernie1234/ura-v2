import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Search, User, Briefcase, MessageSquare } from 'lucide-react';
import { socketService } from '@/services/socket.service';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '@/context/auth-provider';

// 1. Update the Props interface
interface SidebarProps {
  activeTab: 'PERSONAL' | 'BUSINESS';
  setActiveTab: (tab: 'PERSONAL' | 'BUSINESS') => void;
  chatData: any;
}

const ChatSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, chatData }) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user } = useAuthContext();

  const activeProfileId = activeTab === 'PERSONAL' ? user?._id : user?.business?._id;

  if (!chatData) {
    return (
      <div className="flex flex-col h-full border-r border-gray-200 dark:border-slate-800">
        <div className="p-4"><SidebarSkeleton /></div>
      </div>
    );
  }

  const { conversations, isLoading, searchQuery, setSearchQuery } = chatData;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
      {/* HEADER SECTION (Same as yours) */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Messages</h1>
          <button 
            onClick={() => navigate('/dashboard/chat/new')}
            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-all dark:bg-slate-800 dark:text-indigo-400"
          >
            <Edit size={20} />
          </button>
        </div>

        {user?.isBusinessOwner && (
          <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('PERSONAL')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'PERSONAL' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' 
                : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'
              }`}
            >
              <User size={16} /> Personal
            </button>
            <button
              onClick={() => setActiveTab('BUSINESS')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'BUSINESS' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' 
                : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'
              }`}
            >
              <Briefcase size={16} /> Business
            </button>
          </div>
        )}

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-xl text-sm dark:text-white outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
        {isLoading ? (
          <SidebarSkeleton />
        ) : conversations.length > 0 ? (
          <div className="space-y-1">
            {conversations.map((chat: any) => (
              <ConversationItem 
                key={chat._id}
                chat={chat}
                activeProfileId={activeProfileId}
                isActive={conversationId === chat._id}
                onClick={() => navigate(`/dashboard/chat/${chat._id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptySidebarState />
        )}
      </div>
    </div>
  );
};

/* --- UPDATED SUB-COMPONENT --- */

const ConversationItem = ({ chat, activeProfileId, isActive, onClick }: any) => {
  const other = chat.participants.find((p: any) => {
    const pId = typeof p.participantId === 'object' ? p.participantId._id : p.participantId;
    return pId !== activeProfileId;
  });

  const details = other?.participantId;
  const partnerId = typeof details === 'object' ? details._id : details;
  
  // LIVE STATES
  const [isOnline, setIsOnline] = useState(details?.isOnline || false);
  const [liveUnread, setLiveUnread] = useState(chat.unreadCount?.[activeProfileId] || 0);

  // 1. LIVE ONLINE STATUS
  useEffect(() => {
    const handleStatus = (data: { userId: string, status: string }) => {
      if (data.userId === partnerId) {
        setIsOnline(data.status === 'online');
      }
    };
    socketService.on('user_status_changed', handleStatus);
    return () => socketService.off('user_status_changed', handleStatus);
  }, [partnerId]);

  // 2. LIVE UNREAD COUNT
  useEffect(() => {
    // Reset unread locally if this chat becomes active
    if (isActive) setLiveUnread(0);

    const handleNewMessage = (newMessage: any) => {
      // If message is for this chat AND I am NOT currently looking at it
      if (newMessage.conversation === chat._id && !isActive) {
        const senderId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId;
        if (senderId !== activeProfileId) {
          setLiveUnread((prev: number) => prev + 1);
        }
      }
    };

    socketService.on('message:received', handleNewMessage);
    return () => socketService.off('message:received', handleNewMessage);
  }, [chat._id, isActive, activeProfileId]);

  const name = other?.participantModel === 'User' 
    ? `${details?.firstName} ${details?.lastName}` 
    : details?.businessName || "Unknown Business";

  const avatar = details?.profilePicture || details?.businessLogo;

  return (
    <div 
      onClick={onClick}
      className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive 
        ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-100 dark:ring-indigo-900/30' 
        : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 dark:border-slate-700">
          <img 
            src={avatar || '/default-avatar.png'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* LIVE ONLINE DOT */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-in zoom-in duration-300" />
        )}

        {/* 3. TYPE DISTINCTION ICON */}
        <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm border border-gray-100 dark:border-slate-800">
          {other?.participantModel === 'Business' ? (
            <Briefcase size={10} className="text-amber-500" />
          ) : (
            <User size={10} className="text-blue-500" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h4 className={`text-sm font-bold truncate flex items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
            {name}
            {/* Alternative Type Distinction (Text Badge) */}
            {other?.participantModel === 'Business' && (
              <span className="text-[8px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1 rounded uppercase tracking-tighter">Biz</span>
            )}
          </h4>
          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
            {chat.latestMessage ? formatDistanceToNow(new Date(chat.latestMessage.createdAt), { addSuffix: false }) : ''}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-xs truncate pr-4 ${liveUnread > 0 ? 'text-gray-900 dark:text-gray-200 font-bold' : 'text-gray-500 dark:text-slate-400'}`}>
            {chat.latestMessage?.content || "No messages yet"}
          </p>
          
          {/* LIVE UNREAD COUNT BADGE */}
          {liveUnread > 0 && (
            <span className="flex-shrink-0 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg animate-in fade-in zoom-in">
              {liveUnread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ... SidebarSkeleton and EmptySidebarState remain the same

export default ChatSidebar;

const SidebarSkeleton = () => (
  <div className="space-y-4 p-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-full" />
        </div>
      </div>
    ))}
  </div>
);

const EmptySidebarState = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
      <MessageSquare size={24} className="text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">No conversations found</p>
  </div>
);
