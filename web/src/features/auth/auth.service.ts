import { apiClient } from '../../services/api-client';
import {
  LoginInput,
  RegisterInput,
  AuthResponse,
  VerifyPhoneInput,
  SendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
} from './auth.types';

export const authService = {
  login: (data: LoginInput | { emailOrPhone: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterInput | Record<string, unknown>) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout', {}),
  refreshToken: (data: string | RefreshTokenInput) =>
    apiClient.post<{ accessToken: string; refreshToken?: string }>(
      '/auth/refresh',
      typeof data === 'string' ? { refreshToken: data } : data
    ),
  getMe: () => apiClient.get<AuthResponse['user']>('/auth/me'),
  forgotPassword: (data: string | ForgotPasswordInput) =>
    apiClient.post(
      '/auth/forgot-password',
      typeof data === 'string' ? { email: data } : data
    ),
  resetPassword: (data: ResetPasswordInput | { token: string; password?: string; newPassword?: string; email?: string }) =>
    apiClient.post('/auth/reset-password', data),
  verifyPhone: (data: VerifyPhoneInput | { phoneOrEmail?: string; code?: string; phone?: string; otp?: string }) =>
    apiClient.post('/auth/verify-phone', data),
  sendOtp: (data: SendOtpInput | { phoneOrEmail: string }) =>
    apiClient.post('/auth/send-otp', data),
};

export default authService;
