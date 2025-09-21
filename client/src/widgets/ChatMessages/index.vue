<template>
  <div class="messages-container">
    <div
      v-if="messages.length === 0"
      class="empty-state"
    >
      <v-icon
        size="64"
        color="grey-lighten-1"
      >
        mdi-chat-outline
      </v-icon>
      <p class="text-medium-emphasis">Нет сообщений. Начните общение!</p>
    </div>
    
    <div
      v-else
      class="messages-list"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-item"
        :class="{ 'message-item--own': isCurrentUser(message.userId) }"
      >
        <div class="message-avatar">
          <v-avatar size="32">
            <v-img
              v-if="getUserById(message.userId)?.avatar"
              :src="getUserById(message.userId)?.avatar"
              :alt="getUserById(message.userId)?.name"
            />
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
        </div>
        
        <div class="message-content">
          <div class="message-header">
            <span class="message-author">
              {{ getUserById(message.userId)?.name || 'Неизвестный' }}
            </span>
            <span class="message-time">
              {{ formatRelativeTime(message.timestamp) }}
            </span>
          </div>
          
          <div
            class="message-text rounded-xl"
            :class="{ 
              'message-text--unread': !message.isRead, 
              'bg-purple-darken-1': isCurrentUser(message.userId),
              'message-text--sending': message.isSending,
              'message-text--sent': !message.isSending && isCurrentUser(message.userId)
            }"
          >
            {{ message.text }}
            <v-icon 
              v-if="message.isSending" 
              size="12" 
              class="ml-2"
              color="orange"
            >
              mdi-clock-outline
            </v-icon>
            <v-icon 
              v-else-if="isCurrentUser(message.userId)" 
              size="12" 
              class="ml-2"
              color="green"
            >
              mdi-check
            </v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { formatRelativeTime } from '@/shared/lib/utils';

interface Props {
  chatId: string;
}

const props = defineProps<Props>();

const messagesStore = useMessagesStore();
const userStore = useUserStore();

const messages = computed(() => 
  messagesStore.messagesByChat(props.chatId)
);

const isCurrentUser = (userId: string) => 
  userStore.currentUser?.id === userId;

const getUserById = (userId: string) => 
  userStore.users.find(user => user.id === userId);

const scrollToBottom = () => {
  nextTick(() => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.messages-container {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message-item--own {
  flex-direction: row-reverse;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-author {
  font-weight: 500;
  font-size: 0.875rem;
}

.message-time {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.message-text {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 8px 12px;
  word-wrap: break-word;
}

.message-text--sending {
  opacity: 0.7;
  font-style: italic;
}

.message-text--sent {
  opacity: 1;
}

.message-item--own .message-text {
  color: rgb(var(--v-theme-on-primary));
}

.message-item--own .message-content {
  align-items: flex-end;
}

.message-item--own .message-header {
  justify-content: flex-end;
}
</style> 