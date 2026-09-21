import { z } from 'zod';
import { Role } from '../../constants/roles';

export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#^()_+={}[\]:;"'<>,.?/~`|\\-]/, 'Password must contain at least one symbol (@$!%*?&#...)');

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    middleName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(9, 'Phone number must be at least 9 digits').optional().or(z.literal('')),
    password: strongPasswordSchema,
    roles: z.array(z.nativeEnum(Role)).optional(),
    gender: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    maritalStatus: z.string().optional().nullable(),
    profileImageUrl: z.string().optional().nullable(),
    region: z.string().optional().nullable(),
    zone: z.string().optional().nullable(),
    wereda: z.string().optional().nullable(),
    kebele: z.string().optional().nullable(),
  }).refine((data) => (data.email && data.email.trim().length > 0) || (data.phone && data.phone.trim().length > 0), {
    message: 'Either email or phone number is required',
    path: ['email'],
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google ID token is required'),
    role: z.nativeEnum(Role).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, 'Email or phone number is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phoneOrEmail: z.string().min(1, 'Phone or email is required'),
    code: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: strongPasswordSchema,
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    phoneOrEmail: z.string().min(1, 'Phone or email is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: strongPasswordSchema,
  }),
});
