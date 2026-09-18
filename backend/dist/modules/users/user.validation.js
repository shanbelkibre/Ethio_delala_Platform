"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersQuerySchema = exports.updateRolesSchema = exports.updateStatusSchema = exports.verifyNationalIdSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../../constants/roles");
const client_1 = require("@prisma/client");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1).max(50).optional(),
        middleName: zod_1.z.string().max(50).optional(),
        lastName: zod_1.z.string().max(50).optional(),
        phone: zod_1.z.string().min(10).max(20).optional(),
        gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
        dateOfBirth: zod_1.z.string().datetime({ offset: true }).or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
        maritalStatus: zod_1.z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
        profileImageUrl: zod_1.z.string().url().optional().or(zod_1.z.string().startsWith('/uploads/')).optional(),
        region: zod_1.z.string().max(100).optional(),
        zone: zod_1.z.string().max(100).optional(),
        wereda: zod_1.z.string().max(100).optional(),
        kebele: zod_1.z.string().max(100).optional(),
    }),
});
exports.verifyNationalIdSchema = zod_1.z.object({
    body: zod_1.z.object({
        nationalIdNumber: zod_1.z
            .string()
            .regex(/^(?:\d{12}|\d{16})$/, 'National ID must be exactly 12 digits (FIN) or 16 digits (FAN)'),
        consent: zod_1.z.boolean().refine((val) => val === true, {
            message: 'User consent is required for automated National ID e-KYC verification',
        }),
    }),
});
exports.updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        accountStatus: zod_1.z.nativeEnum(client_1.AccountStatus),
    }),
});
exports.updateRolesSchema = zod_1.z.object({
    body: zod_1.z.object({
        roles: zod_1.z.array(zod_1.z.nativeEnum(roles_1.Role)).min(1, 'At least one role is required'),
    }),
});
exports.getUsersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        role: zod_1.z.nativeEnum(roles_1.Role).optional(),
        status: zod_1.z.nativeEnum(client_1.AccountStatus).optional(),
        search: zod_1.z.string().optional(),
    }),
});
