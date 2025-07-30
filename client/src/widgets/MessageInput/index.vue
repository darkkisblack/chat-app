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
import { useSendMessage } from '@/features/sendMessage/model/useSendMessage';
import { useUserStore } from '@/entities/user/model/useUserStore';

interface Props {
  chatId: string;
}

const props = defineProps<Props>();

const { messageText, isSending, error, sendMessage, clearError } = useSendMessage();
const userStore = useUserStore();

const handleSend = async () => {
  if (!userStore.currentUser || !messageText.value.trim()) return;
  
  await sendMessage(props.chatId, userStore.currentUser.id);
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