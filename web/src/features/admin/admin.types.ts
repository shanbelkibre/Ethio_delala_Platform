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
