<template>
  <v-app-bar
    color="purple-darken-1"
    dark
  >
    <v-app-bar-title>Чат приложение</v-app-bar-title>
    
    <v-spacer />
    
    <div
      v-if="currentUser"
      class="d-flex align-center"
    >
      <v-avatar
        size="32"
        class="mr-2"
      >
        <v-img
          v-if="currentUser.avatar"
          :src="currentUser.avatar"
          :alt="currentUser.name"
        />
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>
      
      <span class="mr-4">{{ currentUser.name }}</span>
      
      <v-btn
        icon
        :loading="isLoading"
        @click="handleLogout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '@/features/auth/model/useAuth';
import { useUserStore } from '@/entities/user/model/useUserStore';

const { logout, isLoading } = useAuth();
const userStore = useUserStore();

const currentUser = computed(() => userStore.currentUser);

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>
