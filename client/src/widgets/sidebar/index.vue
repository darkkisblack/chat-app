<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-subheader class="d-flex align-center justify-space-between">
        <span>Чаты</span>
        <v-btn
          icon
          size="small"
          variant="text"
          @click="openCreateDialog"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-list-subheader>
      
      <ChatUIComponent
        v-for="chat in chats"
        :key="chat.id"
        :chat="chat"
        :isActive="currentChatId === chat.id"
        @select="handleChatSelect"
      />
      
      <!-- Заглушка если нет чатов -->
      <v-list-item
        v-if="chats.length === 0"
        class="text-center text-grey"
      >
        <v-list-item-title>
          У вас пока нет чатов
        </v-list-item-title>
        <v-list-item-subtitle>
          Нажмите + чтобы создать чат
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    
    <!-- Диалог создания чата -->
    <CreateChatDialog
      v-model="showCreateDialog"
      @chatCreated="handleChatCreated"
    />
  </v-navigation-drawer>
</template> 

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { useChat } from '@/features/chat/model/useChat';
import ChatUIComponent from '@/entities/chat/ui/ChatUIComponent.vue';
import CreateChatDialog from '@/features/createChat/ui/CreateChatDialog.vue';

const chatStore = useChatStore();
const { currentChatId, selectChat } = useChat();

const showCreateDialog = ref(false);

const chats = computed(() => chatStore.chats);

const handleChatSelect = (chatId: string) => {
  selectChat(chatId);
};

const openCreateDialog = () => {
  showCreateDialog.value = true;
};

const handleChatCreated = (chat: { id: string }) => {
  // Чат уже добавлен в store через useCreateChat
  // Можно сразу переключиться на новый чат
  selectChat(chat.id);
};
</script>
