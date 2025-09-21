export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: Array<{
    id: string;
    name: string;
    surname: string;
    username: string;
    avatar?: string;
    status: string;
    lastActivity: string;
  }>;
  createdBy: {
    id: string;
    name: string;
    surname: string;
    username: string;
  };
  lastMessage?: {
    id: string;
    text: string;
    sender: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}
