<template>
  <v-list-item
    :value="chat.id"
    :active="props.isActive"
    @click="$emit('select', chat.id)"
  >
    <template #prepend>
      <v-icon :color="chat.isPrivate ? 'warning' : 'primary'">
        {{ chat.isPrivate ? 'mdi-lock' : 'mdi-pound' }}
      </v-icon>
    </template>
    
    <v-list-item-title>
      # {{ chat.name }}
    </v-list-item-title>
    
    <v-list-item-subtitle v-if="chat.description">
      {{ chat.description }}
    </v-list-item-subtitle>
    
    <template #append>
      <div class="chat-meta">
        <span
          v-if="chat.memberCount > 0"
          class="member-count"
        >
          {{ chat.memberCount }}
        </span>
        
        <v-badge
          v-if="showUnreadCount && chat.unreadCount > 0"
          :content="chat.unreadCount"
          color="error"
          size="small"
        />
      </div>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import type { Chat } from '@/shared/lib/mockData';

interface Props {
  chat: Chat;
  isActive?: boolean;
  showUnreadCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showUnreadCount: true,
});

defineEmits<{
  select: [chatId: string];
}>();
</script>

<style scoped>
.chat-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-count {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style> 