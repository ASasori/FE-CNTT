// src/api/chatApi.js
import { API_URL } from './apiConfig.js';

export const sendMessageToBackend = async (message) => {
  try {
    const response = await fetch(`${API_URL}/your-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response; // Assuming your backend returns the bot's response here
  } catch (error) {
    console.error('Error:', error);
    return 'Server Error';
  }
};
