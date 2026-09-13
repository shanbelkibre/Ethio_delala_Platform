import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT from Zustand persisted localStorage
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const zustandState = localStorage.getItem('auth-storage');
      if (zustandState) {
        const parsed = JSON.parse(zustandState);
        const token = parsed?.state?.accessToken;
        if (token && config.headers) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
      }
    } catch {}
  }
  return config;
});

// Unwrap response.data and normalize errors
axiosInstance.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Request failed';
    return Promise.reject({
      error: {
        message,
        code: error.response?.data?.error?.code || 'REQUEST_FAILED',
        details: error.response?.data?.error?.details,
      },
      status: error.response?.status,
    });
  }
);

export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<any, T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<any, T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<any, T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<any, T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<any, T>(url, config),
};

export default apiClient;
