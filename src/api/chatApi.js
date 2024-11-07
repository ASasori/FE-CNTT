import axios from 'axios';
import { API_URL } from './apiConfig.js';

//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMnlma2h5NDAwMDB1cGhkbjZiZXRkcnoiLCJpYXQiOjE3MzA0NTI3ODQsImV4cCI6MTc2MTk4ODc4NH0.e5cwsiOVusdeiWGjt7yLK55VqlnuRswwsCVBYYYvqpY'; // Replace with a dynamic way to get the token if needed
const getToken = () => localStorage.getItem('token');
// Function to send a message to the backend
export const sendMessageToBackend = async (message, conversationId) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/messenger`,
      {
        boxChatId: conversationId,
        content: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data.content; // Assuming the response has this structure
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Server Error');
  }
};

// Function to fetch all conversations
export const fetchConversations = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/box-chat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.map(item => ({
      id: item.boxChatId,
      name: item.name,
      messages: [],
    }));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw new Error('Server Error');
  }
};

// Function to fetch a single conversation by ID
export const fetchConversationById = async (conversationId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/box-chat/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.Messenger.map(msg => {
      // Check if the username or userId matches to distinguish between user and chatbot
      const isChatbot = msg.User.username === 'systemSpokeAI'; // Adjust this condition as needed
      return {
        text: msg.content,
        sender: isChatbot ? 'chatbot' : 'user',
      };
    });
  } catch (error) {
    console.error('Error fetching conversation data:', error);
    throw new Error('Server Error');
  }
};

// Function to create a new conversation
export const createNewConversation = async () => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/box-chat`,
      { name: `New Conversation` },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      id: response.data.data.boxChatId,
      name: response.data.data.name,
      messages: [],
    };
  } catch (error) {
    console.error('Error creating a new conversation:', error);
    throw new Error('Server Error');
  }
};

// Function to rename a conversation
export const renameConversation = async (conversationId, newName) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${API_URL}/box-chat/${conversationId}`,
      { name: newName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data.name;
  } catch (error) {
    console.error('Error renaming conversation:', error);
    throw new Error('Server Error');
  }
};

// Function to delete a conversation
export const deleteConversation = async (conversationId) => {
  try {
    const token = getToken();
    await axios.delete(`${API_URL}/box-chat/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw new Error('Server Error');
  }
};
