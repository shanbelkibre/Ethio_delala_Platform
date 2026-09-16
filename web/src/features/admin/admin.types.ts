export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingVerifications: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalRentals: number;
  totalSales: number;
}

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  amount: number;
  currency?: string;
  status: 'PENDING' | 'SUCCESS' | 'COMPLETED' | 'FAILED';
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  isIdentityVerified: boolean;
  createdAt?: string;
}

export interface AdminProperty {
  id: string;
  title: string;
  propertyType: string;
  listingType?: string;
  transactionType?: string;
  price: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
  createdAt?: string;
}

export interface AdminIdentityDoc {
  id: string;
  userId?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  documentType?: string;
  documentNumber?: string;
  idType?: string;
  idNumber?: string;
  documentUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt?: string;
}

export interface AdminLicense {
  id: string;
  propertyId?: string;
  owner?: {
    name?: string;
    email?: string;
  };
  property?: {
    title?: string;
  };
  licenseNumber?: string;
  documentUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt?: string;
}

