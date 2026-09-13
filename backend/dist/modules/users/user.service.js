"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const errors_1 = require("../../utils/errors");
const pagination_1 = require("../../utils/pagination");
class UserService {
    static async getProfile(userId) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return this.mapToResponse(user);
    }
    static async updateProfile(userId, dto) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        let firstName;
        let lastName;
        if (dto.name) {
            const parts = dto.name.trim().split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || undefined;
        }
        const updated = await user_repository_1.UserRepository.updateProfile(userId, {
            phone: dto.phone,
            firstName,
            lastName,
            profileImage: dto.avatarUrl,
        });
        return this.mapToResponse(updated);
    }
    static async updateUserRoles(userId, dto) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const primaryRole = dto.roles[0] || 'RENTER';
        const updated = await user_repository_1.UserRepository.updateRole(userId, primaryRole);
        return this.mapToResponse(updated);
    }
    static async getAllUsers(page = 1, limit = 10) {
        const pagination = (0, pagination_1.parsePagination)({ page, limit });
        const { users, total } = await user_repository_1.UserRepository.findAll(pagination.skip, pagination.limit);
        return {
            users: users.map((u) => this.mapToResponse(u)),
            meta: (0, pagination_1.formatPaginatedMeta)(total, pagination.page, pagination.limit),
        };
    }
    static mapToResponse(user) {
        const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email;
        const roleName = (user.role?.name || 'RENTER');
        return {
            id: user.id,
            name: fullName,
            email: user.email,
            phone: user.phone,
            roles: [roleName],
            avatarUrl: user.profile?.profileImageUrl || null,
            isPhoneVerified: user.identityVerification?.phoneOtpVerified || false,
            isEmailVerified: user.identityVerification?.emailVerified || false,
            isIdentityVerified: user.identityVerification?.nationalIdVerified || false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UserService = UserService;
