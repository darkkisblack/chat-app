// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    LIST: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  CHATS: {
    LIST: '/api/chats',
    BY_ID: (id: string) => `/api/chats/${id}`,
  },
  MESSAGES: {
    LIST: (chatId: string) => `/api/chats/${chatId}/messages`,
    SEND: '/api/messages',
    MARK_READ: (messageId: string) => `/api/messages/${messageId}/read`,
  },
  WEBSOCKET: {
    BASE_URL: 'ws://localhost:3000/ws',
    CHAT: (chatId: string) => `ws://localhost:3000/ws/chats/${chatId}`,
  },
} as const;

// WebSocket event types
export const WS_EVENTS = {
  MESSAGE: 'message',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
} as const;

// User statuses
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
} as const;

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
} as const;

// Chat types (future)
export const CHAT_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct',
} as const;

// UI constants
export const UI_CONSTANTS = {
  MESSAGE_MAX_LENGTH: 1000,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  TYPING_TIMEOUT: 3000, // 3 seconds
  MESSAGE_LOAD_LIMIT: 50,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
