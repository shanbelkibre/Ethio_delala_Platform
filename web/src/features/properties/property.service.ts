import { apiClient } from '../../services/api-client';
import { PropertyFilters } from './property.types';

export const propertyService = {
  getPublicProperties: (filters: PropertyFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    const queryString = params.toString();
    return apiClient.get('/properties' + (queryString ? `?${queryString}` : ''));
  },

  getPropertyById: (id: string) => apiClient.get('/properties/' + id),

  getMyProperties: (filters: PropertyFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    const queryString = params.toString();
    return apiClient.get('/users/me/properties' + (queryString ? `?${queryString}` : ''));
  },

  createProperty: (data: Record<string, unknown> | FormData) => apiClient.post('/properties', data),

  updateProperty: (id: string, data: Record<string, unknown> | FormData) => apiClient.put('/properties/' + id, data),

  deleteProperty: (id: string) => apiClient.delete('/properties/' + id),
};

export default propertyService;
