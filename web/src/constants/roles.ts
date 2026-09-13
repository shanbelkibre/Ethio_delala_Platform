export const ROLES = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  OWNER: 'OWNER',
  RENTER: 'RENTER',
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  ADMIN: '/management/admin/dashboard',
  AGENT: '/management/agent/dashboard',
  OWNER: '/owner/dashboard',
  RENTER: '/renter/dashboard',
};

export const ETHIOPIAN_CITIES = [
  'Addis Ababa',
  'Dire Dawa',
  'Hawassa',
  'Bahir Dar',
  'Adama',
  'Mekelle',
  'Gondar',
  'Jimma',
  'Bishoftu',
] as const;

export const ADDIS_ABABA_SUBCITIES = [
  'Bole',
  'Yeka',
  'Kirkos',
  'Arada',
  'Lideta',
  'Nifas Silk-Lafto',
  'Kolfe Keranio',
  'Gullele',
  'Akaky Kaliti',
  'Addis Ketema',
  'Lemi Kura',
] as const;
