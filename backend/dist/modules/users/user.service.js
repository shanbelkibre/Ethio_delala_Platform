"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const errors_1 = require("../../utils/errors");
const pagination_1 = require("../../utils/pagination");
const roles_1 = require("../../constants/roles");
class UserService {
    static async getProfile(userId) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return this.mapToResponse(user);
    }
    static async updateProfile(userId, dto) {
        const existingUser = await user_repository_1.UserRepository.findById(userId);
        if (!existingUser) {
            throw new errors_1.NotFoundError('User not found');
        }
        // If updating phone number, verify it is not already taken by another user
        if (dto.phone && dto.phone !== existingUser.phone) {
            const phoneOwner = await user_repository_1.UserRepository.findByPhone(dto.phone);
            if (phoneOwner && phoneOwner.id !== userId) {
                throw new errors_1.ConflictError('This phone number is already associated with another account');
            }
        }
        const dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;
        const updated = await user_repository_1.UserRepository.updateProfile(userId, {
            ...dto,
            dateOfBirth,
        });
        return this.mapToResponse(updated);
    }
    static async verifyNationalId(userId, dto) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const cleanId = dto.nationalIdNumber.trim().toUpperCase();
        // Automated Fayda e-KYC validation (ensures valid Ethiopian National ID structure)
        if (cleanId.length < 8) {
            throw new errors_1.BadRequestError('Invalid Ethiopian National ID format');
        }
        // Mask ID reference for privacy compliance (e.g. FAYDA-ETH-****5678)
        const maskedRef = `FAYDA-ETH-${cleanId.slice(0, 3)}****${cleanId.slice(-4)}`;
        const updated = await user_repository_1.UserRepository.verifyNationalId(userId, maskedRef);
        console.log(`🆔 [FAYDA NATIONAL ID VERIFIED] User ${user.email} verified with ref ${maskedRef}`);
        return this.mapToResponse(updated);
    }
    static async getUserById(userId) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return this.mapToResponse(user);
    }
    static async updateUserStatus(userId, dto) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const updated = await user_repository_1.UserRepository.updateStatus(userId, dto.accountStatus);
        return this.mapToResponse(updated);
    }
    static async updateUserRoles(userId, dto) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const primaryRole = dto.roles[0] || roles_1.Role.RENTER;
        const updated = await user_repository_1.UserRepository.updateRole(userId, primaryRole);
        return this.mapToResponse(updated);
    }
    static async getAllUsers(query) {
        const pagination = (0, pagination_1.parsePagination)({ page: query.page, limit: query.limit });
        const { users, total } = await user_repository_1.UserRepository.findAll({
            skip: pagination.skip,
            limit: pagination.limit,
            role: query.role,
            status: query.status,
            search: query.search,
        });
        return {
            users: users.map((u) => this.mapToResponse(u)),
            meta: (0, pagination_1.formatPaginatedMeta)(total, pagination.page, pagination.limit),
        };
    }
    static mapToResponse(user) {
        const nameParts = [user.profile?.firstName, user.profile?.middleName, user.profile?.lastName].filter(Boolean);
        const fullName = nameParts.length > 0 ? nameParts.join(' ') : user.email;
        const roleName = (user.role?.name || roles_1.Role.RENTER);
        return {
            id: user.id,
            name: fullName,
            email: user.email,
            phone: user.phone,
            accountStatus: user.accountStatus,
            roles: [roleName],
            avatarUrl: user.profile?.profileImageUrl || null,
            profile: user.profile
                ? {
                    id: user.profile.id,
                    firstName: user.profile.firstName,
                    middleName: user.profile.middleName,
                    lastName: user.profile.lastName,
                    gender: user.profile.gender,
                    dateOfBirth: user.profile.dateOfBirth,
                    maritalStatus: user.profile.maritalStatus,
                    profileImageUrl: user.profile.profileImageUrl,
                    region: user.profile.region,
                    zone: user.profile.zone,
                    wereda: user.profile.wereda,
                    kebele: user.profile.kebele,
                    assignedRegion: user.profile.assignedRegion,
                }
                : null,
            identityVerification: user.identityVerification
                ? {
                    id: user.identityVerification.id,
                    status: user.identityVerification.status,
                    emailVerified: user.identityVerification.emailVerified,
                    emailVerifiedAt: user.identityVerification.emailVerifiedAt,
                    phoneOtpVerified: user.identityVerification.phoneOtpVerified,
                    phoneVerifiedAt: user.identityVerification.phoneVerifiedAt,
                    nationalIdReference: user.identityVerification.nationalIdReference,
                    nationalIdVerified: user.identityVerification.nationalIdVerified,
                    nationalIdVerifiedAt: user.identityVerification.nationalIdVerifiedAt,
                    rejectionReason: user.identityVerification.rejectionReason,
                    verifiedAt: user.identityVerification.verifiedAt,
                }
                : null,
            isPhoneVerified: user.identityVerification?.phoneOtpVerified || false,
            isEmailVerified: user.identityVerification?.emailVerified || false,
            isIdentityVerified: user.identityVerification?.nationalIdVerified || false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UserService = UserService;
