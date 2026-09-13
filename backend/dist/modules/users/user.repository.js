"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = exports.userInclude = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
exports.userInclude = {
    role: true,
    profile: true,
    identityVerification: true,
};
class UserRepository {
    static async findById(id) {
        return (0, database_1.withReconnect)(() => database_1.prisma.user.findUnique({
            where: { id },
            include: exports.userInclude,
        }));
    }
    static async findByEmail(email) {
        return (0, database_1.withReconnect)(() => database_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: exports.userInclude,
        }));
    }
    static async findByPhone(phone) {
        return (0, database_1.withReconnect)(() => database_1.prisma.user.findUnique({
            where: { phone },
            include: exports.userInclude,
        }));
    }
    static async updateProfile(userId, data) {
        const { phone, ...profileData } = data;
        return (0, database_1.withReconnect)(() => database_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...(phone && { phone }),
                profile: {
                    upsert: {
                        create: {
                            firstName: profileData.firstName || '',
                            middleName: profileData.middleName,
                            lastName: profileData.lastName,
                            gender: profileData.gender,
                            dateOfBirth: profileData.dateOfBirth,
                            maritalStatus: profileData.maritalStatus,
                            profileImageUrl: profileData.profileImageUrl,
                            region: profileData.region,
                            zone: profileData.zone,
                            wereda: profileData.wereda,
                            kebele: profileData.kebele,
                        },
                        update: {
                            ...(profileData.firstName !== undefined && { firstName: profileData.firstName }),
                            ...(profileData.middleName !== undefined && { middleName: profileData.middleName }),
                            ...(profileData.lastName !== undefined && { lastName: profileData.lastName }),
                            ...(profileData.gender !== undefined && { gender: profileData.gender }),
                            ...(profileData.dateOfBirth !== undefined && { dateOfBirth: profileData.dateOfBirth }),
                            ...(profileData.maritalStatus !== undefined && { maritalStatus: profileData.maritalStatus }),
                            ...(profileData.profileImageUrl !== undefined && { profileImageUrl: profileData.profileImageUrl }),
                            ...(profileData.region !== undefined && { region: profileData.region }),
                            ...(profileData.zone !== undefined && { zone: profileData.zone }),
                            ...(profileData.wereda !== undefined && { wereda: profileData.wereda }),
                            ...(profileData.kebele !== undefined && { kebele: profileData.kebele }),
                        },
                    },
                },
            },
            include: exports.userInclude,
        }));
    }
    static async verifyNationalId(userId, nationalIdReference) {
        const now = new Date();
        return (0, database_1.withReconnect)(() => database_1.prisma.user.update({
            where: { id: userId },
            data: {
                identityVerification: {
                    upsert: {
                        create: {
                            nationalIdReference,
                            nationalIdVerified: true,
                            nationalIdVerifiedAt: now,
                            status: client_1.VerificationStatus.VERIFIED,
                            verifiedAt: now,
                        },
                        update: {
                            nationalIdReference,
                            nationalIdVerified: true,
                            nationalIdVerifiedAt: now,
                            status: client_1.VerificationStatus.VERIFIED,
                            verifiedAt: now,
                            rejectionReason: null,
                        },
                    },
                },
            },
            include: exports.userInclude,
        }));
    }
    static async updateStatus(userId, accountStatus) {
        return (0, database_1.withReconnect)(() => database_1.prisma.user.update({
            where: { id: userId },
            data: { accountStatus },
            include: exports.userInclude,
        }));
    }
    static async updateRole(userId, roleName) {
        const roleRecord = await database_1.prisma.role.findUnique({ where: { name: roleName } });
        if (!roleRecord) {
            throw new Error(`Role ${roleName} does not exist`);
        }
        return (0, database_1.withReconnect)(() => database_1.prisma.user.update({
            where: { id: userId },
            data: { roleId: roleRecord.id },
            include: exports.userInclude,
        }));
    }
    static async findAll(params) {
        const { skip = 0, limit = 10, role, status, search } = params;
        const where = {
            ...(status && { accountStatus: status }),
            ...(role && { role: { name: role } }),
            ...(search && {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search } },
                    { profile: { firstName: { contains: search, mode: 'insensitive' } } },
                    { profile: { lastName: { contains: search, mode: 'insensitive' } } },
                ],
            }),
        };
        const [users, total] = await Promise.all([
            (0, database_1.withReconnect)(() => database_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: exports.userInclude,
            })),
            (0, database_1.withReconnect)(() => database_1.prisma.user.count({ where })),
        ]);
        return { users, total };
    }
}
exports.UserRepository = UserRepository;
