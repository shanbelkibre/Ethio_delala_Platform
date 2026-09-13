import { apiClient } from '../../services/api-client';
import { CmsConfig } from './cms.types';

export const cmsService = {
  getConfig: () => apiClient.get('/cms'),
  updateConfig: (data: Partial<CmsConfig>) => apiClient.put('/cms', data),
};

export default cmsService;
