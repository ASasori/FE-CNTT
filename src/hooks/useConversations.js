// hooks/useConversations.js
import { useEffect, useState } from 'react';
import { fetchConversations, fetchConversationById } from '../api/chatApi';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations);
        const savedIndex = localStorage.getItem('selectedConversationIndex');
        setCurrentConversationIndex(savedIndex ? parseInt(savedIndex, 10) : 0);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };
    loadConversations();
  }, []);

  const loadConversationMessages = async (index) => {
    try {
      const conversationId = conversations[index]?.id;
      if (conversationId) {
        const messages = await fetchConversationById(conversationId);
        setConversations(prev => {
          const updated = [...prev];
          updated[index].messages = messages;
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  };

  return { conversations, currentConversationIndex, setCurrentConversationIndex, loadConversationMessages };
}
