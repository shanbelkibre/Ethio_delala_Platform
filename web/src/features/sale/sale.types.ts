export type SaleRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface SaleRequest {
  id: string;
  propertyId: string;
  buyerId: string;
  status: SaleRequestStatus;
  offeredPrice?: number;
  message?: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    price: number;
    city: string;
  };
}

export interface CreateSaleRequestInput {
  offeredPrice?: number;
  message?: string;
}
