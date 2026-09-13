import { Role } from '../../constants/roles';
import { AccountStatus, VerificationStatus } from '@prisma/client';

export interface ProfileData {
  id?: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  maritalStatus?: string | null;
  profileImageUrl?: string | null;
  region?: string | null;
  zone?: string | null;
  wereda?: string | null;
  kebele?: string | null;
  assignedRegion?: string | null;
}

export interface IdentityVerificationData {
  id?: string;
  status: VerificationStatus;
  emailVerified: boolean;
  emailVerifiedAt?: Date | null;
  phoneOtpVerified: boolean;
  phoneVerifiedAt?: Date | null;
  nationalIdReference?: string | null;
  nationalIdVerified: boolean;
  nationalIdVerifiedAt?: Date | null;
  rejectionReason?: string | null;
  verifiedAt?: Date | null;
}

export interface UpdateProfileDTO {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  profileImageUrl?: string;
  region?: string;
  zone?: string;
  wereda?: string;
  kebele?: string;
}

export interface VerifyNationalIdDTO {
  nationalIdNumber: string; //15 digits Fayda Identification Number (FIN / FAN)
  consent: boolean;
}

export interface UpdateStatusDTO {
  accountStatus: AccountStatus;
}

export interface UpdateRolesDTO {
  roles: Role[];
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  role?: Role;
  status?: AccountStatus;
  search?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: AccountStatus;
  roles: Role[];
  avatarUrl?: string | null;
  profile?: ProfileData | null;
  identityVerification?: IdentityVerificationData | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
