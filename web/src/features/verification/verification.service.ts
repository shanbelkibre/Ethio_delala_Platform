import { apiClient } from '../../services/api-client';

export const verificationService = {
  uploadIdentityDocument: (formData: FormData) =>
    apiClient.post('/verification/identity', formData),
  uploadOwnerLicense: (formData: FormData) =>
    apiClient.post('/verification/license', formData),
  uploadPropertyDocument: (propertyId: string, formData: FormData) =>
    apiClient.post('/verification/property/' + propertyId, formData),
  getMyVerification: () => apiClient.get('/verification/my'),
  getAdminVerifications: () => apiClient.get('/verification/admin'),
  reviewVerification: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) =>
    apiClient.patch('/verification/admin/' + id, { status, reason }),
};

export default verificationService;
