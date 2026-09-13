export type PlanTier = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  price: number;
  durationDays: number;
  maxListings: number;
  featuredListings: number;
  description?: string;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  plan?: SubscriptionPlan;
}
