import { ref } from 'vue';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { useChatStore } from '@/entities/chat/model/useChatStore';

export const useMarkReadMessage = () => {
  const isMarking = ref(false);
  const error = ref<string | null>(null);

  const messagesStore = useMessagesStore();
  const chatStore = useChatStore();

  const markMessageAsRead = async (messageId: string) => {
    isMarking.value = true;
    error.value = null;

    try {
      // TODO: Отправить запрос на сервер
      // await markMessageReadApi(messageId);

      // Обновляем локальное состояние
      messagesStore.markAsRead(messageId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to mark message as read';
    } finally {
      isMarking.value = false;
    }
  };

  const markChatAsRead = async (chatId: string) => {
    isMarking.value = true;
    error.value = null;

    try {
      // TODO: Отправить запрос на сервер
      // await markChatReadApi(chatId);

      // Обновляем локальное состояние
      messagesStore.markChatAsRead(chatId);
      chatStore.markChatAsRead(chatId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to mark chat as read';
    } finally {
      isMarking.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    isMarking,
    error,
    markMessageAsRead,
    markChatAsRead,
    clearError,
  };
};
