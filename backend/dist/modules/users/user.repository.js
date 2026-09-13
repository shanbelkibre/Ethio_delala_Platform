"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = exports.userInclude = void 0;
const database_1 = require("../../config/database");
exports.userInclude = {
    role: true,
    profile: true,
    identityVerification: true,
};
class UserRepository {
    static async findById(id) {
        return database_1.prisma.user.findUnique({
            where: { id },
            include: exports.userInclude,
        });
    }
    static async findByEmail(email) {
        return database_1.prisma.user.findUnique({
            where: { email },
            include: exports.userInclude,
        });
    }
    static async update(id, data) {
        return database_1.prisma.user.update({
            where: { id },
            data,
            include: exports.userInclude,
        });
    }
    static async updateProfile(id, data) {
        const { phone, firstName, lastName, profileImage } = data;
        return database_1.prisma.user.update({
            where: { id },
            data: {
                ...(phone && { phone }),
                profile: {
                    upsert: {
                        create: {
                            firstName: firstName || '',
                            lastName,
                            profileImageUrl: profileImage,
                        },
                        update: {
                            ...(firstName !== undefined && { firstName }),
                            ...(lastName !== undefined && { lastName }),
                            ...(profileImage !== undefined && { profileImageUrl: profileImage }),
                        },
                    },
                },
            },
            include: exports.userInclude,
        });
    }
    static async updateRole(id, roleName) {
        const roleRecord = await database_1.prisma.role.findUnique({ where: { name: roleName } });
        if (!roleRecord) {
            throw new Error(`Role ${roleName} not found`);
        }
        return database_1.prisma.user.update({
            where: { id },
            data: {
                roleId: roleRecord.id,
            },
            include: exports.userInclude,
        });
    }
    static async findAll(skip = 0, limit = 10) {
        const [users, total] = await Promise.all([
            database_1.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: exports.userInclude,
            }),
            database_1.prisma.user.count(),
        ]);
        return { users, total };
    }
}
exports.UserRepository = UserRepository;
