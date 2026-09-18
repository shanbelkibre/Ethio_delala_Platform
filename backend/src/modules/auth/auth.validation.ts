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
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
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
