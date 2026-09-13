export type RentalRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface RentalRequest {
  id: string;
  propertyId: string;
  renterId: string;
  status: RentalRequestStatus;
  moveInDate?: string;
  durationMonths?: number;
  message?: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    price: number;
    city: string;
  };
}

export interface CreateRentalRequestInput {
  moveInDate?: string;
  durationMonths?: number;
  message?: string;
}
