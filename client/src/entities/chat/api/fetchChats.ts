import type { Chat } from '@/shared/lib/mockData';

export const fetchChats = async (): Promise<Chat[]> => {
  // TODO: Заменить на реальный API
  const response = await fetch('/api/chats');
  if (!response.ok) {
    throw new Error('Failed to fetch chats');
  }
  return response.json();
};

export const fetchChatById = async (id: string): Promise<Chat> => {
  const response = await fetch(`/api/chats/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat');
  }
  return response.json();
};
