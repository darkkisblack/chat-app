import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { WS_EVENTS } from './constants';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    // Если уже подключены с тем же токеном, не переподключаемся
    if (this.socket && this.socket.connected && this.token === token) {
      return;
    }
    
    // Отключаемся от предыдущего соединения если есть
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.token = token;
    this.socket = io('http://localhost:3000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
      reconnection: false,
      reconnectionAttempts: 0,
      reconnectionDelay: 1000
    });

    this.socket?.on('connect', () => {
      this.joinChats();
    });

    this.socket?.on('disconnect', () => {
      // Соединение разорвано
    });

    this.socket?.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket?.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Не пытаемся переподключиться при ошибке аутентификации
      if (error.message === 'Authentication error') {
        this.socket?.disconnect();
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChats() {
    if (this.socket) {
      this.socket.emit(WS_EVENTS.JOIN_CHATS);
    }
  }

  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit(WS_EVENTS.JOIN_CHAT, chatId);
    }
  }

  leaveChat(chatId: string) {
    if (this.socket) {
      this.socket.emit(WS_EVENTS.LEAVE_CHAT, chatId);
    }
  }

  sendMessage(chatId: string, text: string, attachments: string[] = []) {
    if (this.socket) {
      this.socket.emit(WS_EVENTS.SEND_MESSAGE, {
        chatId,
        text,
        attachments
      });
    }
  }

  onNewMessage(callback: (message: unknown) => void) {
    if (this.socket) {
      this.socket.on(WS_EVENTS.NEW_MESSAGE, callback);
    }
  }

  onError(callback: (error: unknown) => void) {
    if (this.socket) {
      this.socket.on(WS_EVENTS.ERROR, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
