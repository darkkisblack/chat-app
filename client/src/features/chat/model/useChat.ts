import { ref, computed } from 'vue';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { socketService } from '@/shared/lib/socket';
import { fetchChats } from '@/entities/chat/api/fetchChats';
import { API_ENDPOINTS } from '@/shared/lib/constants';
import type { Chat } from '@/shared/types/chat';

export const useChat = () => {
  const currentChatId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const chatStore = useChatStore();
  const messagesStore = useMessagesStore();

  const currentChat = computed(() =>
    currentChatId.value
      ? chatStore.chats.find((chat: Chat) => chat.id === currentChatId.value)
      : null
  );

  const currentMessages = computed(() =>
    currentChatId.value ? messagesStore.messagesByChat(currentChatId.value) : []
  );

  const selectChat = async (chatId: string) => {
    if (currentChatId.value === chatId) return;

    isLoading.value = true;
    error.value = null;

    try {
      // Отключаемся от предыдущего чата
      if (currentChatId.value) {
        socketService.leaveChat(currentChatId.value);
      }

      // Подключаемся к WebSocket
      socketService.joinChat(chatId);

      // Обновляем текущий чат в store
      chatStore.setCurrentChat(chatId);
      currentChatId.value = chatId;

      // Отмечаем сообщения как прочитанные
      messagesStore.markChatAsRead(chatId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки чата';
    } finally {
      isLoading.value = false;
    }
  };

  const loadChats = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const chats = await fetchChats();
      chatStore.setChats(chats);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Ошибка загрузки чатов';
    } finally {
      isLoading.value = false;
    }
  };

  const createChat = async (chatData: Omit<Chat, 'id' | 'unreadCount'>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(API_ENDPOINTS.CHATS.LIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания чата');
      }

      const newChat = await response.json();
      chatStore.addChat(newChat.chat);

      return newChat.chat;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Ошибка создания канала';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    currentChatId,
    currentChat,
    currentMessages,
    isLoading,
    error,
    selectChat,
    loadChats,
    createChat,
    clearError,
  };
};
