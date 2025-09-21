<template>
  <div class="message-input">
    <div class="message-input__container">
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="handleAttachment"
      >
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
      
      <v-text-field
        v-model="messageText"
        placeholder="Введите сообщение..."
        variant="outlined"
        hideDetails
        density="compact"
        class="message-input__field rounded-xl"
        @keydown="handleKeyPress"
      />
    </div>
    
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="compact"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { socketService } from '@/shared/lib/socket';

interface Props {
  chatId: string;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const messagesStore = useMessagesStore();

const messageText = ref('');
const isSending = ref(false);
const error = ref('');

const handleSend = async () => {
  if (!userStore.currentUser || !messageText.value.trim() || isSending.value) return;
  
  isSending.value = true;
  error.value = '';
  
  try {
    const messageTextValue = messageText.value.trim();
    
    // Создаем временное сообщение для отображения
    const tempMessage = {
      id: `temp_${Date.now()}`,
      text: messageTextValue,
      userId: userStore.currentUser!.id,
      chatId: props.chatId,
      timestamp: new Date(),
      isRead: false,
      isSending: true
    };
    
    // Добавляем в store
    messagesStore.addMessage(tempMessage);
    
    // Отправляем через WebSocket
    socketService.sendMessage(props.chatId, messageTextValue);
    
    // Очищаем поле ввода
    messageText.value = '';
  } catch (err) {
    error.value = 'Ошибка отправки сообщения';
    console.error('Send message error:', err);
  } finally {
    isSending.value = false;
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
};

const handleAttachment = () => {
  // TODO: Реализовать загрузку файлов
  console.log('Добавить вложение');
};

const clearError = () => {
  error.value = '';
};
</script>

<style scoped>
.message-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-input__container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-input__field {
  flex: 1;
}

/* Кастомные стили для v-text-field */
.message-input__field :deep(.v-field) {
  border-radius: 12px !important;
}

.message-input__field :deep(.v-field__outline) {
  border-radius: 12px !important;
}
</style> 