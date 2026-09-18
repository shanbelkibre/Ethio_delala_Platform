export interface AgentDashboardStats {
  region?: string;
  totalProperties?: number;
  activeListings?: number;
  pendingRequests?: number;
  verifiedOwners?: number;
}

export interface AgentPropertyAction {
  propertyId: string;
  action: 'APPROVE' | 'REJECT' | 'VERIFY';
  notes?: string;
}

export interface AgentProperty {
  id: string;
  title: string;
  propertyType: string;
  listingType?: string;
  transactionType?: string;
  price: number;
  city?: string;
  subCity?: string;
  status: string;
  createdAt?: string;
}

export interface AgentRequest {
  id: string;
  type?: string;
  status: string;
  propertyId?: string;
  property?: {
    title?: string;
  };
  user?: {
    name?: string;
    phone?: string;
  };
  renter?: {
    name?: string;
    phone?: string;
  };
  buyer?: {
    name?: string;
    phone?: string;
  };
  createdAt?: string;
}

export interface AgentReport {
  id: string;
  reason?: string;
  details?: string;
  status: string;
  propertyId?: string;
  createdAt?: string;
}

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  isIdentityVerified: boolean;
  createdAt?: string;
}

