import { apiClient } from '../../services/api-client';
import { SendMessageInput } from './message.types';

export const messageService = {
  getConversations: () => apiClient.get('/messaging/conversations'),
  getMessages: (conversationId: string) =>
    apiClient.get('/messaging/conversations/' + conversationId),
  sendMessage: (data: SendMessageInput) => apiClient.post('/messaging', data),
};

export default messageService;
