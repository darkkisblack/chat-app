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
              <span v-if="currentChatId"># {{ currentChatId }}</span>
              <span v-else>Выберите чат</span>
            </v-card-title>

            <!-- Сообщения -->
            <v-card-text class="chat-messages flex-grow-1">
              <ChatMessages 
                v-if="currentChatId" 
                :chatId="currentChatId" 
              />
              <div 
                v-else 
                class="d-flex align-center justify-center fill-height"
              >
                <v-card-text class="text-center">
                  <v-icon 
                    size="64" 
                    color="grey"
                  >
                    mdi-chat-outline
                  </v-icon>
                  <div class="text-h6 mt-4">Выберите чат для начала общения</div>
                  <div class="text-body-2 text-grey">Создайте новый чат или выберите существующий</div>
                </v-card-text>
              </div>
            </v-card-text>

            <!-- Ввод сообщения -->
            <div 
              v-if="currentChatId" 
              class="chat-input"
            >
              <MessageInput 
                :chatId="currentChatId" 
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/widgets/Header/index.vue';
import MessageInput from '@/widgets/MessageInput/index.vue';
import ChatMessages from '@/widgets/ChatMessages/index.vue';
import ChatSidebar from '@/widgets/sidebar/index.vue';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { useMessagesStore, type Message } from '@/entities/message/model/useMessagesStore';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { useAuth } from '@/features/auth/model/useAuth';
import { fetchUsers } from '@/entities/user/api/fetchUsers';
import { fetchChats } from '@/entities/chat/api/fetchChats';
import { fetchMessages } from '@/entities/message/api/fetchMessages';
import { socketService } from '@/shared/lib/socket';

const router = useRouter();
const { isAuthenticated, initAuth } = useAuth();
const userStore = useUserStore();
const messagesStore = useMessagesStore();
const chatStore = useChatStore();

const currentChatId = computed(() => chatStore.currentChatId);

// Инициализация данных
onMounted(async () => {
  // Инициализируем аутентификацию
  initAuth();
  
  // Проверяем авторизацию
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!token || !isAuthenticated.value) {
    router.push('/auth');
    return;
  }

  try {
    // Загружаем пользователей
    const users = await fetchUsers();
    users.forEach(user => userStore.addUser(user));
    
    // Загружаем чаты
    const chats = await fetchChats();
    chatStore.setChats(chats);
    
    // Если нет выбранного чата, выбираем первый
    if (!currentChatId.value && chats.length > 0) {
      chatStore.setCurrentChat(chats[0].id);
    }
    
    // Загружаем сообщения для текущего чата
    if (currentChatId.value) {
      const messages = await fetchMessages(currentChatId.value);
      messages.forEach(message => messagesStore.addMessage(message));
    }

    // Настраиваем WebSocket события
    socketService.onNewMessage((message: unknown) => {
      const newMessage = message as Message;
      
      // Проверяем, есть ли временное сообщение с таким же текстом
      const tempMessage = messagesStore.messages.find(msg => 
        msg.isSending && 
        msg.text === newMessage.text && 
        msg.chatId === newMessage.chatId
      );
      
      if (tempMessage) {
        // Обновляем временное сообщение на реальное
        messagesStore.updateMessage(tempMessage.id, {
          id: newMessage.id,
          isSending: false,
          timestamp: newMessage.timestamp
        });
      } else {
        // Добавляем новое сообщение
        messagesStore.addMessage(newMessage);
      }
    });

    socketService.onError((error) => {
      console.error('Socket error:', error);
    });
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
