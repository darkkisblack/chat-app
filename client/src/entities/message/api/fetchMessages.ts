import type { Message } from '../model/useMessagesStore';

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`/api/messages/chat/${chatId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  const data = await response.json();
  return data.messages || [];
};
