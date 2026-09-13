"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpSchema = exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerSchema = exports.strongPasswordSchema = void 0;
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
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(10, 'Phone number must be at least 10 digits'),
        password: exports.strongPasswordSchema,
        roles: zod_1.z.array(zod_1.z.nativeEnum(roles_1.Role)).optional(),
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
