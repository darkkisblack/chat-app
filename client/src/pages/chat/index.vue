<template>
  <div class="chat-layout">
    <Header />
    
    <v-container
      fluid
      class="chat-page"
    >
      <v-row class="fill-height">
        <!-- Сайдбар с чатами -->
        <ChatSidebar />

        <!-- Основная область чата -->
        <v-col
          cols="12"
          class="chat-main"
        >
          <v-card class="fill-height d-flex flex-column">
            <!-- Заголовок чата -->
            <v-card-title class="chat-header">
              # {{ currentChatId }}
            </v-card-title>

            <!-- Сообщения -->
            <v-card-text class="chat-messages flex-grow-1">
              <ChatMessages :chatId="currentChatId" />
            </v-card-text>

            <!-- Ввод сообщения -->
            <div class="chat-input">
              <MessageInput :chatId="currentChatId" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Header from '@/widgets/Header/index.vue';
import MessageInput from '@/widgets/MessageInput/index.vue';
import ChatMessages from '@/widgets/ChatMessages/index.vue';
import ChatSidebar from '@/widgets/Sidebar/index.vue';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { useMessagesStore } from '@/entities/message/model/useMessagesStore';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { mockApi } from '@/shared/lib/mockData';

const userStore = useUserStore();
const messagesStore = useMessagesStore();
const chatStore = useChatStore();

const currentChatId = computed(() => chatStore.currentChatId);

// Инициализация моковых данных
onMounted(async () => {
  try {
    // Загружаем пользователей
    const users = await mockApi.fetchUsers();
    users.forEach(user => userStore.addUser(user));
    
    // Устанавливаем текущего пользователя
    userStore.setCurrentUser(users[0]);
    
    // Загружаем чаты
    const chats = await mockApi.fetchChats();
    chatStore.setChats(chats);
    
    // Загружаем сообщения для текущего чата
    const messages = await mockApi.fetchMessages(currentChatId.value);
    messages.forEach(message => messagesStore.addMessage(message));
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }
});
</script>

<style scoped>
.chat-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-page {
  flex: 1;
  padding: 0;
}

.chat-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.chat-main {
  padding: 0;
}

.chat-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.chat-messages {
  overflow-y: auto;
  min-height: 400px;
}

.chat-input {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 16px;
  width: 100%;
}
</style>
