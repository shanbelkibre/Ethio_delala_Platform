import { apiClient } from '../../services/api-client';
import { SearchFilters } from './search.types';

export const searchService = {
  search: (filters: SearchFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    const queryString = params.toString();
    return apiClient.get('/search' + (queryString ? `?${queryString}` : ''));
  },
};

export default searchService;
