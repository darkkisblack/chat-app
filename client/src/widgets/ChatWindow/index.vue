<template>
  <div class="chat-window">
    <div
      v-if="!currentChat"
      class="chat-placeholder"
    >
      <v-icon
        size="64"
        color="grey"
      >
        mdi-chat-outline
      </v-icon>
      <p>Выберите чат для начала общения</p>
    </div>

    <div
      v-else
      class="chat-content"
    >
      <!-- Заголовок чата -->
      <div class="chat-header">
        <h3># {{ currentChat.name }}</h3>
        <p
          v-if="currentChat.description"
          class="chat-description"
        >
          {{ currentChat.description }}
        </p>
      </div>

      <!-- Сообщения -->
      <div class="messages-container">
        <div
          v-if="isLoading"
          class="loading"
        >
          <v-progress-circular indeterminate />
        </div>
        
        <div
          v-else-if="currentMessages.length === 0"
          class="no-messages"
        >
          <p>Нет сообщений. Начните первым!</p>
        </div>
        
        <div
          v-else
          class="messages-list"
        >
          <MessageUIComponent
            v-for="message in currentMessages"
            :key="message.id"
            :message="message"
            :isOwn="isOwnMessage(message.userId)"
          />
        </div>
      </div>

      <!-- Поле ввода -->
      <MessageInput :chatId="currentChat.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChat } from '@/features/chat/model/useChat';
import { useAuth } from '@/features/auth/model/useAuth';
import ChatMessages from '@/widgets/ChatMessages/index.vue';
import MessageInput from '@/widgets/MessageInput/index.vue';
import MessageUIComponent from '@/entities/message/ui/MessageUIComponent.vue';

const { currentChat, currentMessages, isLoading } = useChat();
const { user } = useAuth();

const isOwnMessage = (messageUserId: string) => messageUserId === user.value?.id;
</script>

<style scoped>
.chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: grey;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.chat-description {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.loading,
.no-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: grey;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style> 