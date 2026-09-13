export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  propertyId?: string;
  content: string;
  readAt?: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
  };
  recipient?: {
    id: string;
    name: string;
  };
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface SendMessageInput {
  recipientId: string;
  propertyId?: string;
  content: string;
}
