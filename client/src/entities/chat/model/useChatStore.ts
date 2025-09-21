import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Chat } from '@/shared/types/chat';

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<string | null>(null);

  const currentChat = computed(() =>
    chats.value.find(chat => chat.id === currentChatId.value)
  );

  const groupChats = computed(() =>
    chats.value.filter(chat => chat.isGroup)
  );

  const privateChats = computed(() =>
    chats.value.filter(chat => !chat.isGroup)
  );

  const setChats = (newChats: Chat[]) => {
    chats.value = newChats;
  };

  const addChat = (chat: Chat) => {
    const existingIndex = chats.value.findIndex(c => c.id === chat.id);
    if (existingIndex >= 0) {
      chats.value[existingIndex] = chat;
    } else {
      chats.value.push(chat);
    }
  };

  const setCurrentChat = (chatId: string | null) => {
    currentChatId.value = chatId;
  };

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    const chat = chats.value.find(ch => ch.id === chatId);
    if (chat) {
      Object.assign(chat, updates);
    }
  };

  return {
    chats,
    currentChatId,
    currentChat,
    groupChats,
    privateChats,
    setChats,
    addChat,
    setCurrentChat,
    updateChat,
  };
});
