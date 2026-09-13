import { apiClient } from '../../services/api-client';
import { InitializePaymentInput } from './payment.types';

export const paymentService = {
  initializePayment: (data: InitializePaymentInput) => apiClient.post('/payments/initialize', data),
  verifyPayment: (txRef: string) => apiClient.get('/payments/verify/' + txRef),
  getAdminPayments: () => apiClient.get('/admin/payments'),
};

export default paymentService;
