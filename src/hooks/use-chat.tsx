import { useState, useEffect, useCallback, useMemo } from 'react';
import { chatAPI } from '@/lib/chat-api';
import { socketService } from '@/services/socket.service';

export const useChat = (activeProfileId: string) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isError, setIsError] = useState(false); // Added this
  // 1. Fetch all conversations for the active Tab (User or Business)
  const fetchConversations = useCallback(async () => {
    setIsError(false);
    try {
      const { data } = await chatAPI.getConversations(activeProfileId);
      setConversations(data.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setIsError(true);
    }
  }, [activeProfileId]);

  // 2. Initial Setup: Connect Socket and Fetch List
  useEffect(() => {
    if (!activeProfileId) return;

    // Connect and identify this connection as the current Profile
    socketService.connect();
    socketService.setup(activeProfileId);

    fetchConversations();

    // Listen for live message updates
    socketService.on('message:received', (newMessage) => {
      // Logic: If message belongs to current profile, refresh list to show preview/unread
      // We'll handle pushing to the 'messages' array inside the MessageWindow component
      fetchConversations();
    });

    return () => {
      socketService.off('message:received');
    };
  }, [activeProfileId, fetchConversations]);

  // 3. Search Filter Logic (Local filtering for performance)
  const filteredConversations = useMemo(() => {
    return conversations.filter((chat) => {
      const otherParticipant = chat.participants.find(
        (p: any) => p.participantId !== activeProfileId
      );
      const name = otherParticipant?.participantModel === 'User'
        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
        : otherParticipant.businessName;

      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery, activeProfileId]);

return {
    conversations: filteredConversations,
    messages,
    setMessages,
    isLoading,
    isError, // Now returned to satisfy the Dashboard
    searchQuery,
    setSearchQuery,
    fetchConversations,
  };
};