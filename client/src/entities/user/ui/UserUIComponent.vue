<template>
  <div
    class="user-component"
    :class="`user-component--${size}`"
  >
    <v-avatar :size="size === 'small' ? 32 : size === 'large' ? 64 : 48">
      <v-img
        v-if="user.avatar"
        :src="user.avatar"
        :alt="user.name"
      />
      <v-icon v-else>mdi-account</v-icon>
    </v-avatar>
    
    <div class="user-info">
      <div class="user-name">{{ user.name }}</div>
      <div
        v-if="showStatus"
        class="user-status"
      >
        <v-icon
          :color="statusColor"
          size="small"
        >
          mdi-circle
        </v-icon>
        {{ user.status }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '../model/useUserStore';

interface Props {
  user: User;
  showStatus?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: true,
  size: 'medium',
});

const statusColor = computed(() => {
  switch (props.user.status) {
    case 'online': return 'success';
    case 'away': return 'warning';
    case 'offline': return 'grey';
    default: return 'grey';
  }
});
</script>

<style scoped>
.user-component {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.user-component--small .user-name {
  font-size: 0.875rem;
}

.user-component--large .user-name {
  font-size: 1.125rem;
}
</style> 