export const Role = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  OWNER: 'OWNER',
  RENTER: 'RENTER',
  BUYER: 'BUYER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
