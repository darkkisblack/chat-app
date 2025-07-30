import type { Message } from '../model/useMessagesStore';

interface SendMessageRequest {
  text: string;
  chatId: string;
  userId: string;
}

export const sendMessageApi = async (
  request: SendMessageRequest
): Promise<Message> => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};
