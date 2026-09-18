import { apiClient } from '../../services/api-client';

export const uploadService = {
  uploadFile: async (file: File): Promise<{ success?: boolean; url?: string; fileUrl?: string; message?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default uploadService;
