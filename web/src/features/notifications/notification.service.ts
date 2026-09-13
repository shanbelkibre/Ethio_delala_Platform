import { apiClient } from '../../services/api-client';

export const notificationService = {
  getMyNotifications: (page = 1) => apiClient.get('/notifications?page=' + page),
  markRead: (id: string) => apiClient.patch('/notifications/' + id + '/read', {}),
  markAllRead: () => apiClient.patch('/notifications/read-all', {}),
};

export default notificationService;
