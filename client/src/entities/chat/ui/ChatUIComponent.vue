<template>
  <v-list-item
    :value="chat.id"
    :active="props.isActive"
    @click="$emit('select', chat.id)"
  >
    <template #prepend>
      <v-avatar size="32">
        <v-img
          v-if="chatAvatar"
          :src="chatAvatar"
          :alt="chatTitle"
        />
        <v-icon v-else>
          {{ chat.isGroup ? 'mdi-account-group' : 'mdi-account' }}
        </v-icon>
      </v-avatar>
    </template>
    
    <v-list-item-title>
      {{ chatTitle }}
    </v-list-item-title>
    
    <v-list-item-subtitle v-if="lastMessage">
      {{ lastMessage }}
    </v-list-item-subtitle>
    
    <template #append>
      <div class="chat-meta">
        <v-badge
          v-if="showUnreadCount && unreadCount > 0"
          :content="unreadCount"
          color="error"
          size="small"
        />
        <v-chip
          v-if="chat.isGroup"
          size="x-small"
          color="primary"
          variant="tonal"
        >
          {{ chat.participants.length }}
        </v-chip>
      </div>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Chat } from '@/shared/types/chat';
import { useUserStore } from '@/entities/user/model/useUserStore';

interface Props {
  chat: Chat;
  isActive?: boolean;
  showUnreadCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showUnreadCount: true,
});

const userStore = useUserStore();

defineEmits<{
  select: [chatId: string];
}>();

// Вычисляем название чата
const chatTitle = computed(() => {
  if (props.chat.isGroup) {
    return props.chat.name || 'Групповой чат';
  } else {
    // Для личного чата показываем имя собеседника
    const currentUserId = userStore.currentUser?.id;
    const otherParticipant = props.chat.participants.find(p => p.id !== currentUserId);
    return otherParticipant ? `${otherParticipant.name} ${otherParticipant.surname || ''}`.trim() : 'Личный чат';
  }
});

// Аватар чата
const chatAvatar = computed(() => {
  if (props.chat.isGroup) {
    return null; // Для групп пока без аватара
  } else {
    const currentUserId = userStore.currentUser?.id;
    const otherParticipant = props.chat.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.avatar;
  }
});

// Последнее сообщение
const lastMessage = computed(() => {
  if (props.chat.lastMessage) {
    return props.chat.lastMessage.text;
  }
  return null;
});

// Количество непрочитанных (пока заглушка)
const unreadCount = computed(() => {
  return 0; // TODO: Реализовать подсчет непрочитанных
});
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