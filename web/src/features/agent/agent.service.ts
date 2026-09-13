import { apiClient } from '../../services/api-client';

export const agentService = {
  getDashboardStats: () => apiClient.get('/agent/stats'),
  getRegionalProperties: () => apiClient.get('/agent/properties'),
  getRegionalRequests: () => apiClient.get('/agent/requests'),
  getRegionalUsers: () => apiClient.get('/agent/users'),
  getReports: () => apiClient.get('/agent/reports'),
};

export default agentService;
