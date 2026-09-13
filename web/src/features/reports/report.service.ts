import { apiClient } from '../../services/api-client';
import { CreateReportInput } from './report.types';

export const reportService = {
  createReport: (data: CreateReportInput) => apiClient.post('/reports', data),
  getAdminReports: () => apiClient.get('/admin/reports'),
  resolveReport: (id: string, action: 'RESOLVE' | 'DISMISS') =>
    apiClient.patch('/admin/reports/' + id, { action }),
};

export default reportService;
