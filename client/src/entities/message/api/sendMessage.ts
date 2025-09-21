import type { Message } from '../model/useMessagesStore';

interface SendMessageRequest {
  text: string;
  chatId: string;
  userId: string;
}

export const sendMessageApi = async (
  request: SendMessageRequest
): Promise<Message> => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`/api/messages/chat/${request.chatId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      text: request.text,
      attachments: []
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};
