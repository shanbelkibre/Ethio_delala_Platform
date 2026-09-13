import { apiClient } from '../../services/api-client';
import { UpdateProfileInput } from './profile.types';

export const profileService = {
  getMe: () => apiClient.get('/users/me'),
  updateProfile: (data: UpdateProfileInput) => apiClient.put('/users/me', data),
  getUserById: (id: string) => apiClient.get('/users/' + id),
};

export default profileService;
