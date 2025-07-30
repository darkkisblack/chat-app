import { ref, onMounted, onUnmounted } from 'vue';
import { useMessagesStore } from './useMessagesStore';
import type { Message } from './useMessagesStore';

export const useMessageSocket = () => {
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const messagesStore = useMessagesStore();

  const connect = (chatId: string) => {
    const wsUrl = `ws://localhost:3000/ws/chats/${chatId}`;

    socket.value = new WebSocket(wsUrl);

    socket.value.onopen = () => {
      isConnected.value = true;
      console.log('WebSocket connected');
    };

    socket.value.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
          const message: Message = {
            id: data.message.id,
            text: data.message.text,
            userId: data.message.userId,
            chatId: data.message.chatId,
            timestamp: new Date(data.message.timestamp),
            isRead: false,
          };

          messagesStore.addMessage(message);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.value.onclose = () => {
      isConnected.value = false;
      console.log('WebSocket disconnected');
    };

    socket.value.onerror = error => {
      console.error('WebSocket error:', error);
      isConnected.value = false;
    };
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  };

  const sendMessage = (
    message: Omit<Message, 'id' | 'timestamp' | 'isRead'>
  ) => {
    if (socket.value && isConnected.value) {
      socket.value.send(
        JSON.stringify({
          type: 'send_message',
          message,
        })
      );
    }
  };

  onMounted(() => {
    // Подключаемся к WebSocket при монтировании компонента
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
  };
};
