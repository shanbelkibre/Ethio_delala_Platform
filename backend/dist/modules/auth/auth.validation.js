"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.sendOtpSchema = exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.loginSchema = exports.googleAuthSchema = exports.registerSchema = exports.strongPasswordSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../../constants/roles");
exports.strongPasswordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#^()_+={}[\]:;"'<>,.?/~`|\\-]/, 'Password must contain at least one symbol (@$!%*?&#...)');
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').optional(),
        middleName: zod_1.z.string().optional().nullable(),
        lastName: zod_1.z.string().optional().nullable(),
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
        phone: zod_1.z.string().min(9, 'Phone number must be at least 9 digits').optional().or(zod_1.z.literal('')),
        password: exports.strongPasswordSchema,
        roles: zod_1.z.array(zod_1.z.nativeEnum(roles_1.Role)).optional(),
        gender: zod_1.z.string().optional().nullable(),
        dateOfBirth: zod_1.z.string().optional().nullable(),
        maritalStatus: zod_1.z.string().optional().nullable(),
        profileImageUrl: zod_1.z.string().optional().nullable(),
        region: zod_1.z.string().optional().nullable(),
        zone: zod_1.z.string().optional().nullable(),
        wereda: zod_1.z.string().optional().nullable(),
        kebele: zod_1.z.string().optional().nullable(),
    }).refine((data) => (data.email && data.email.trim().length > 0) || (data.phone && data.phone.trim().length > 0), {
        message: 'Either email or phone number is required',
        path: ['email'],
    }),
});
exports.googleAuthSchema = zod_1.z.object({
    body: zod_1.z.object({
        idToken: zod_1.z.string().min(1, 'Google ID token is required'),
        role: zod_1.z.nativeEnum(roles_1.Role).optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        emailOrPhone: zod_1.z.string().min(1, 'Email or phone number is required'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.verifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneOrEmail: zod_1.z.string().min(1, 'Phone or email is required'),
        code: zod_1.z.string().length(6, 'OTP must be 6 digits'),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Please provide a valid email address'),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Reset token is required'),
        password: exports.strongPasswordSchema,
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
exports.sendOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneOrEmail: zod_1.z.string().min(1, 'Phone or email is required'),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, 'Current password is required'),
        newPassword: exports.strongPasswordSchema,
    }),
});
