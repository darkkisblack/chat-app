import { ref, computed } from 'vue';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { useMessageSocket } from '@/entities/message/model/useMessageSocket';
import { API_ENDPOINTS } from '@/shared/lib/constants';
import type { Chat } from '@/shared/lib/mockData';

export const useChat = () => {
  const currentChatId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const chatStore = useChatStore();
  const messagesStore = useMessagesStore();
  const { connect: connectSocket, disconnect: disconnectSocket } =
    useMessageSocket();

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
        disconnectSocket();
      }

      // Загружаем сообщения чата (пока используем mock)
      // TODO: Реализовать loadMessages в store

      // Подключаемся к WebSocket
      connectSocket(chatId);

      // Обновляем текущий чат
      currentChatId.value = chatId;

      // Отмечаем чат как прочитанный
      await chatStore.markChatAsRead(chatId);
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
      // TODO: Реализовать loadChats в store
      // Пока используем mock данные
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
      // TODO: Добавить addChat метод в store
      // chatStore.addChat(newChat);

      return newChat;
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
