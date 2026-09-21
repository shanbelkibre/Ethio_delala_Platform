import { Role } from '../../constants/roles';

export interface RegisterDTO {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  password: string;
  roles?: Role[];
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  maritalStatus?: string | null;
  profileImageUrl?: string | null;
  region?: string | null;
  zone?: string | null;
  wereda?: string | null;
  kebele?: string | null;
}

export interface GoogleAuthDTO {
  idToken: string;
  role?: Role;
}

export interface LoginDTO {
  emailOrPhone: string;
  password: string;
}

export interface VerifyOtpDTO {
  phoneOrEmail: string;
  code: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: Role[];
    avatarUrl?: string | null;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
