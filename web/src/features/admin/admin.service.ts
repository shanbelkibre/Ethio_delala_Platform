import { apiClient } from '../../services/api-client';

export const adminService = {
  getPublicStats: () => apiClient.get('/stats'),
  getStats: () => apiClient.get('/admin/stats'),
  getAuditLogs: () => apiClient.get('/admin/audit-logs'),
  getProperties: () => apiClient.get('/admin/properties'),
  getPayments: () => apiClient.get('/admin/payments'),
  getUsers: () => apiClient.get('/users'),
  updateUserRoles: (userId: string, roles: string[]) =>
    apiClient.patch('/users/' + userId + '/roles', { roles }),
  updateUserStatus: (userId: string, status: string) =>
    apiClient.patch('/users/' + userId + '/status', { status }),
  updatePropertyStatus: (id: string, status: string) =>
    apiClient.patch(`/properties/${id}/status`, { status }),
  getPendingVerifications: () => apiClient.get('/verification/pending'),
  getAllVerifications: () => apiClient.get('/verification/all'),
  reviewVerification: (id: string, type: 'identity' | 'license', status: 'VERIFIED' | 'REJECTED') => {
    const endpoint = type === 'identity'
      ? `/verification/identity/${id}/review`
      : `/verification/license/${id}/review`;
    return apiClient.patch(endpoint, { status });
  },
  getSubscriptionPlans: () => apiClient.get('/subscriptions/all-plans'),
  updateSubscriptionPlan: (id: string, data: any) => apiClient.patch('/subscriptions/plans/' + id, data),
  createSubscriptionPlan: (data: any) => apiClient.post('/subscriptions/plans', data),
};

export default adminService;

