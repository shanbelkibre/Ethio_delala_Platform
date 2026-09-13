export type Role = 'OWNER' | 'RENTER' | 'BUYER' | 'ADMIN' | 'AGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: Role[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  createdAt: string;
}
