<template>
  <div
    class="message"
    :class="messageClass"
  >
    <div
      v-if="showAvatar && !isOwn"
      class="message-avatar"
    >
      <v-avatar size="32">
        <v-icon>mdi-account</v-icon>
      </v-avatar>
    </div>
    
    <div class="message-content">
      <div
        v-if="!isOwn"
        class="message-author"
      >
        {{ message.userId }}
      </div>
      
      <div class="message-text">
        {{ message.text }}
      </div>
      
      <div
        v-if="showTime"
        class="message-time"
      >
        {{ formatRelativeTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Message } from '../model/useMessagesStore';
import { formatRelativeTime } from '@/shared/lib/utils';

interface Props {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true,
  showTime: true,
});

const messageClass = computed(() => ({
  'message--own': props.isOwn,
  'message--unread': !props.message.isRead,
}));
</script>

<style scoped>
.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.message--own {
  flex-direction: row-reverse;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-author {
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.message-text {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  margin-bottom: 4px;
}

.message--unread .message-text {
  background: rgba(var(--v-theme-primary), 0.1);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.message--own .message-text {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.message-time {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.message--own .message-time {
  text-align: right;
}
</style> 