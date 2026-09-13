export const Role = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  OWNER: 'OWNER',
  RENTER: 'RENTER',
  BUYER: 'RENTER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
