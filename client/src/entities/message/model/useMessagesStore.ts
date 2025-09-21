import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Message {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  timestamp: Date | string;
  isRead: boolean;
  isSending?: boolean;
  attachments?: string[];
}

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Message[]>([]);

  const messagesByChat = computed(
  () => (chatId: string) =>
    messages.value.filter(msg => msg.chatId === chatId)
);

  const unreadCount = computed(
    () => messages.value.filter(msg => !msg.isRead).length
  );

  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const markAsRead = (messageId: string) => {
    const message = messages.value.find(msg => msg.id === messageId);
    if (message) {
      message.isRead = true;
    }
  };

  const markChatAsRead = (chatId: string) => {
    messages.value
      .filter(msg => msg.chatId === chatId && !msg.isRead)
      .forEach(msg => (msg.isRead = true));
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    const message = messages.value.find(msg => msg.id === messageId);
    if (message) {
      Object.assign(message, updates);
    }
  };

  const removeMessage = (messageId: string) => {
    const index = messages.value.findIndex(msg => msg.id === messageId);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
  };

  return {
    messages,
    messagesByChat,
    unreadCount,
    addMessage,
    updateMessage,
    removeMessage,
    markAsRead,
    markChatAsRead,
  };
});
