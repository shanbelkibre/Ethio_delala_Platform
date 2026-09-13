import { apiClient } from '../../services/api-client';
import { LoginInput, RegisterInput } from './auth.types';

export const authService = {
  login: (data: LoginInput) => apiClient.post('/auth/login', data),
  register: (data: RegisterInput) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout', {}),
  refreshToken: (refreshToken: string) => apiClient.post('/auth/refresh', { refreshToken }),
  getMe: () => apiClient.get('/auth/me'),
};

export default authService;
