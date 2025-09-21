import type { Chat } from '@/shared/types/chat';

export const fetchChats = async (): Promise<Chat[]> => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch('/api/chats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch chats');
  }
  const data = await response.json();
  return data.chats || [];
};

export const fetchChatById = async (id: string): Promise<Chat> => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`/api/chats/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch chat');
  }
  const data = await response.json();
  return data.chat;
};
