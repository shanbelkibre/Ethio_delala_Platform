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

export interface VerifyPhoneInput {
  phoneOrEmail: string;
  code: string;
}

export interface SendOtpInput {
  phoneOrEmail: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface GoogleAuthInput {
  idToken: string;
  role?: string;
}
