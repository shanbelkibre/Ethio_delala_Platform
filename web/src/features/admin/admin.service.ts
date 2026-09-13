import { apiClient } from '../../services/api-client';

export const adminService = {
  getStats: () => apiClient.get('/admin/stats'),
  getAuditLogs: () => apiClient.get('/admin/audit-logs'),
  getProperties: () => apiClient.get('/admin/properties'),
  getPayments: () => apiClient.get('/admin/payments'),
  getUsers: () => apiClient.get('/users'),
  updateUserRoles: (userId: string, roles: string[]) =>
    apiClient.patch('/users/' + userId + '/roles', { roles }),
};

export default adminService;
