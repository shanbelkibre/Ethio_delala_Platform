import { apiClient } from '../../services/api-client';

export const uploadService = {
  uploadFile: async (file: File): Promise<{ success: boolean; url: string; fileUrl: string; message?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res: any = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const url = res?.data?.url || res?.url || res?.data?.fileUrl || res?.fileUrl || '';
    return {
      success: Boolean(url || res?.success),
      url,
      fileUrl: url,
      message: res?.message,
    };
  },
};

export default uploadService;

