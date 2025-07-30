import type { User } from '@/entities/user/model/useUserStore';
import type { Message } from '@/entities/message/model/useMessagesStore';

export interface Chat {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  lastMessage?: Message;
  unreadCount: number;
}

// Моковые пользователи
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Алексей Петров',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'online',
  },
  {
    id: '3',
    name: 'Дмитрий Иванов',
    email: 'dmitry@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'away',
  },
  {
    id: '4',
    name: 'Анна Козлова',
    email: 'anna@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'offline',
  },
];

// Моковые чаты
export const mockChats: Chat[] = [
  {
    id: 'general',
    name: 'general',
    description: 'Общий канал для всех',
    isPrivate: false,
    memberCount: 4,
    unreadCount: 2,
  },
  {
    id: 'random',
    name: 'random',
    description: 'Случайные темы',
    isPrivate: false,
    memberCount: 3,
    unreadCount: 0,
  },
  {
    id: 'work',
    name: 'work',
    description: 'Рабочие вопросы',
    isPrivate: true,
    memberCount: 2,
    unreadCount: 1,
  },
];

// Моковые сообщения
export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Привет всем! Как дела?',
    userId: '1',
    chatId: 'general',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
    isRead: true,
  },
  {
    id: '2',
    text: 'Привет! Все хорошо, спасибо!',
    userId: '2',
    chatId: 'general',
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 минут назад
    isRead: true,
  },
  {
    id: '3',
    text: 'Кто готов к завтрашней встрече?',
    userId: '3',
    chatId: 'general',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 минут назад
    isRead: false,
  },
  {
    id: '4',
    text: 'Я готов! У меня есть вопросы по проекту.',
    userId: '1',
    chatId: 'general',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 минут назад
    isRead: false,
  },
  {
    id: '5',
    text: 'Отлично! Давайте обсудим детали.',
    userId: '2',
    chatId: 'random',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 час назад
    isRead: true,
  },
];

// Функции для генерации новых данных
export const generateMessage = (
  text: string,
  userId: string,
  chatId: string
): Message => ({
  id: Math.random().toString(36).substring(2),
  text,
  userId,
  chatId,
  timestamp: new Date(),
  isRead: false,
});

// Функции для имитации API
export const mockApi = {
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  async fetchUsers(): Promise<User[]> {
    await this.delay();
    return mockUsers;
  },

  async fetchChats(): Promise<Chat[]> {
    await this.delay();
    return mockChats;
  },

  async fetchMessages(chatId: string): Promise<Message[]> {
    await this.delay();
    return mockMessages.filter(msg => msg.chatId === chatId);
  },

  async sendMessage(
    message: Omit<Message, 'id' | 'timestamp' | 'isRead'>
  ): Promise<Message> {
    await this.delay(300);
    const newMessage = generateMessage(
      message.text,
      message.userId,
      message.chatId
    );
    mockMessages.push(newMessage);
    return newMessage;
  },
};
