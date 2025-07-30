import { ref } from 'vue';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { sendMessageApi } from '@/entities/message/api/sendMessage';

export const useSendMessage = () => {
  const messageText = ref('');
  const isSending = ref(false);
  const error = ref<string | null>(null);

  const messagesStore = useMessagesStore();

  const sendMessage = async (chatId: string, userId: string) => {
    if (!messageText.value.trim()) return;

    isSending.value = true;
    error.value = null;

    try {
      const message = await sendMessageApi({
        text: messageText.value,
        chatId,
        userId,
      });

      messagesStore.addMessage(message);
      messageText.value = '';
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to send message';
    } finally {
      isSending.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    messageText,
    isSending,
    error,
    sendMessage,
    clearError,
  };
};
