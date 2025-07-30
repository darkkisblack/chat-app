import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Chat } from '@/shared/lib/mockData';

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<string>('general');

  const currentChat = computed(() =>
    chats.value.find(chat => chat.id === currentChatId.value)
  );

  const publicChats = computed(() =>
    chats.value.filter(chat => !chat.isPrivate)
  );

  const privateChats = computed(() =>
    chats.value.filter(chat => chat.isPrivate)
  );

  const setChats = (newChats: Chat[]) => {
    chats.value = newChats;
  };

  const setCurrentChat = (chatId: string) => {
    currentChatId.value = chatId;
  };

  const updateUnreadCount = (chatId: string, count: number) => {
    const chat = chats.value.find(ch => ch.id === chatId);
    if (chat) {
      chat.unreadCount = count;
    }
  };

  const markChatAsRead = (chatId: string) => {
    updateUnreadCount(chatId, 0);
  };

  return {
    chats,
    currentChatId,
    currentChat,
    publicChats,
    privateChats,
    setChats,
    setCurrentChat,
    updateUnreadCount,
    markChatAsRead,
  };
});
