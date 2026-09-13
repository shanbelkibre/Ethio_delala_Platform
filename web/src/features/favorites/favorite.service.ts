import { apiClient } from '../../services/api-client';

export const favoriteService = {
  getMyFavorites: () => apiClient.get('/favorites'),
  addFavorite: (propertyId: string) => apiClient.post('/favorites/' + propertyId),
  removeFavorite: (propertyId: string) => apiClient.delete('/favorites/' + propertyId),
  toggleFavorite: async (propertyId: string, isFav: boolean) => {
    if (isFav) {
      return apiClient.delete('/favorites/' + propertyId);
    } else {
      return apiClient.post('/favorites/' + propertyId);
    }
  },
};

export default favoriteService;
