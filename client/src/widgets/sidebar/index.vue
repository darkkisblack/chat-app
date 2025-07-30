<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-subheader>Чаты</v-list-subheader>
      <ChatUIComponent
        v-for="chat in chats"
        :key="chat.id"
        :chat="chat"
        :isActive="currentChatId === chat.id"
        @select="handleChatSelect"
      />
    </v-list>
  </v-navigation-drawer>
</template> 

<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '@/entities/chat/model/useChatStore';
import { useChat } from '@/features/chat/model/useChat';
import ChatUIComponent from '@/entities/chat/ui/ChatUIComponent.vue';

const chatStore = useChatStore();
const { currentChatId, selectChat } = useChat();

const chats = computed(() => chatStore.chats);

const handleChatSelect = (chatId: string) => {
  selectChat(chatId);
};
</script>
