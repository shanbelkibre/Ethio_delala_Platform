import { apiClient as coreApiClient, axiosInstance } from './api-client';

export const apiClient = {
  get: (url: string, _auth = false) => coreApiClient.get(url),
  post: (url: string, data?: unknown, _auth = false) => coreApiClient.post(url, data),
  put: (url: string, data?: unknown, _auth = false) => coreApiClient.put(url, data),
  patch: (url: string, data?: unknown, _auth = false) => coreApiClient.patch(url, data),
  delete: (url: string, _auth = false) => coreApiClient.delete(url),
};

export { axiosInstance };
export default axiosInstance;
