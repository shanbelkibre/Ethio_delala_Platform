export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentTransaction {
  id: string;
  txRef: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'CHAPA' | 'TELEBIRR' | 'CBE_BIRR';
  planId?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InitializePaymentInput {
  amount: number;
  currency?: string;
  planId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
