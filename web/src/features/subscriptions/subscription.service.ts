import { apiClient } from '../../services/api-client';

export const subscriptionService = {
  getPlans: () => apiClient.get('/subscriptions/plans'),
  getMySubscription: () => apiClient.get('/subscriptions/my'),
  subscribe: (planId: string) => apiClient.post('/subscriptions', { planId }),
  cancelSubscription: () => apiClient.delete('/subscriptions/my'),
};

export default subscriptionService;
