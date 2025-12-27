import React, { useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { useChat } from '@/hooks/use-chat';
import { useAuthContext } from '@/context/auth-provider';

const ChatsPage = () => {
  const { user } = useAuthContext();
  const { conversationId } = useParams();
  const location = useLocation();

  // 1. Manage the Active Tab here
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');

  // 2. Calculate the Profile ID
  const activeProfileId = activeTab === 'PERSONAL' ? user?._id : user?.business?._id;

  // 3. RUN THE HOOK HERE
  // This is now the "Single Source of Truth" for the entire chat feature
  const chatData = useChat(activeProfileId!);

  const isDetailView = !!conversationId || location.pathname.includes('/new');

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white dark:bg-slate-900">
      {/* SIDEBAR */}
      <aside className={`${isDetailView ? 'hidden' : 'flex'} md:flex w-full md:w-80 flex-col border-r`}>
        <ChatSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          chatData={chatData} // Pass the hook results down
        />
      </aside>

      {/* CHAT CONTENT */}
      <main className={`${!isDetailView ? 'hidden' : 'flex'} md:flex flex-1 flex-col`}>
        {/* Pass data to MessageWindow or NewChatSelector via Outlet Context */}
        <Outlet context={{ chatData, activeTab, activeProfileId }} />
      </main>
    </div>
  );
};

export default ChatsPage;