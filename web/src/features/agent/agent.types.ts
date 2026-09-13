export interface AgentDashboardStats {
  region: string;
  totalProperties: number;
  activeListings: number;
  pendingRequests: number;
  verifiedOwners: number;
}

export interface AgentPropertyAction {
  propertyId: string;
  action: 'APPROVE' | 'REJECT' | 'VERIFY';
  notes?: string;
}
