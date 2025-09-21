import { ref } from 'vue';
import { createChat, type CreateChatRequest } from '@/entities/chat/api/chatApi';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { useToastStore } from '@/shared/lib/useToastStore';

export const useCreateChat = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const chatStore = useChatStore();
  const { showSuccess, showError } = useToastStore();

  const createNewChat = async (data: CreateChatRequest) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await createChat(data);
      
      if (response.success && response.chat) {
        // Добавляем новый чат в store
        chatStore.addChat(response.chat);
        showSuccess('Чат успешно создан');
        return response.chat;
      } else {
        throw new Error(response.message || 'Ошибка создания чата');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания чата';
      error.value = errorMessage;
      showError(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    isLoading,
    error,
    createNewChat,
    clearError,
  };
};
