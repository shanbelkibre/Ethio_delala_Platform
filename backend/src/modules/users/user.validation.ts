import { z } from 'zod';
import { Role } from '../../constants/roles';
import { AccountStatus } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    middleName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    phone: z.string().min(10).max(20).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    dateOfBirth: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
    profileImageUrl: z.string().url().optional().or(z.string().startsWith('/uploads/')).optional(),
    region: z.string().max(100).optional(),
    zone: z.string().max(100).optional(),
    wereda: z.string().max(100).optional(),
    kebele: z.string().max(100).optional(),
  }),
});

export const verifyNationalIdSchema = z.object({
  body: z.object({
    nationalIdNumber: z
      .string()
      .regex(
        /^(?:\d{12}|\d{16})$/,
        'National ID must be exactly 12 digits (FIN) or 16 digits (FAN)',
      ),

    consent: z.boolean().refine((val) => val === true, {
      message:
        'User consent is required for automated National ID e-KYC verification',
    }),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    accountStatus: z.nativeEnum(AccountStatus),
  }),
});

export const updateRolesSchema = z.object({
  body: z.object({
    roles: z.array(z.nativeEnum(Role)).min(1, 'At least one role is required'),
  }),
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    role: z.nativeEnum(Role).optional(),
    status: z.nativeEnum(AccountStatus).optional(),
    search: z.string().optional(),
  }),
});
