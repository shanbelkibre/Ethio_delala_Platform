export interface LoginInput {
  emailOrPhone: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  roles: string[];
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    roles: string[];
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isIdentityVerified?: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
