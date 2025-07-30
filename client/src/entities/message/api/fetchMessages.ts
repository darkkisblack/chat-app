import type { Message } from '../model/useMessagesStore';

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const response = await fetch(`/api/chats/${chatId}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};
