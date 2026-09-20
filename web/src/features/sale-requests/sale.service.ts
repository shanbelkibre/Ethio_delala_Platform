import { apiClient } from '../../services/api-client';

export const saleService = {
  createRequest: (propertyId: string, data: Record<string, unknown>) =>
    apiClient.post('/sales/' + propertyId + '/requests', data),
  getMyRequests: (role?: 'owner' | 'buyer') =>
    apiClient.get('/sales/requests?role=' + (role || 'buyer')),
  acceptRequest: (id: string) => apiClient.patch('/sales/requests/' + id + '/accept', {}),
  rejectRequest: (id: string) => apiClient.patch('/sales/requests/' + id + '/reject', {}),
};

export default saleService;
