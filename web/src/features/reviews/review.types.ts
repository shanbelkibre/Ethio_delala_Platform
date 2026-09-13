export interface Review {
  id: string;
  propertyId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface CreateReviewInput {
  propertyId: string;
  rating: number;
  comment: string;
}
