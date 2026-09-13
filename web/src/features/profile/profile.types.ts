import { Role } from '../../types/user';

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  subCity?: string;
  region?: string;
  idDocumentUrl?: string;
  idDocumentType?: string;
  isVerified: boolean;
}

export interface FullUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: Role[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  bio?: string;
  city?: string;
  subCity?: string;
  avatarUrl?: string;
}
