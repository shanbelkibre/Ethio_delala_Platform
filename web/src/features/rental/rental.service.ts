import { apiClient } from '../../services/api-client';

export const rentalService = {
  createRentalRequest: (propertyId: string, data: any) =>
    apiClient.post('/rentals/' + propertyId + '/requests', data),
  createRequest: (propertyId: string, data: any) =>
    apiClient.post('/rentals/' + propertyId + '/requests', data),
  getMyRequests: (role?: 'owner' | 'renter') =>
    apiClient.get('/rentals/requests?role=' + (role || 'renter')),
  acceptRequest: (id: string) => apiClient.patch('/rentals/requests/' + id + '/accept', {}),
  rejectRequest: (id: string) => apiClient.patch('/rentals/requests/' + id + '/reject', {}),
};

export default rentalService;
