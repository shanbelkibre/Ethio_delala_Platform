import { apiClient } from '../../services/api-client';
import { CreateReviewInput } from './review.types';

export const reviewService = {
  getPropertyReviews: (propertyId: string) => apiClient.get('/properties/' + propertyId + '/reviews'),
  createReview: (data: CreateReviewInput) => apiClient.post('/reviews', data),
  deleteReview: (reviewId: string) => apiClient.delete('/reviews/' + reviewId),
};

export default reviewService;
