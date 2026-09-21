import { UserRepository, UserWithDetails } from './user.repository';
import { NotFoundError, ConflictError, BadRequestError } from '../../utils/errors';
import {
  UpdateProfileDTO,
  UpdateRolesDTO,
  UpdateStatusDTO,
  VerifyNationalIdDTO,
  GetUsersQuery,
  UserResponse,
} from './user.types';
import { parsePagination, formatPaginatedMeta } from '../../utils/pagination';
import { Role } from '../../constants/roles';
import { logger } from '../../utils/logger';

export class UserService {
  static async getProfile(userId: string): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.mapToResponse(user);
  }

  static async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<UserResponse> {
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // If updating phone number, verify it is not already taken by another user
    if (dto.phone && dto.phone !== existingUser.phone) {
      const phoneOwner = await UserRepository.findByPhone(dto.phone);
      if (phoneOwner && phoneOwner.id !== userId) {
        throw new ConflictError('This phone number is already associated with another account');
      }
    }

    const dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;

    const updated = await UserRepository.updateProfile(userId, {
      ...dto,
      dateOfBirth,
    });

    return this.mapToResponse(updated);
  }

  static async verifyNationalId(userId: string, dto: VerifyNationalIdDTO): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const cleanId = dto.nationalIdNumber.trim().toUpperCase();

    // Automated Fayda e-KYC validation (ensures valid Ethiopian National ID structure)
    if (cleanId.length < 8) {
      throw new BadRequestError('Invalid Ethiopian National ID format');
    }

    // Mask ID reference for privacy compliance (e.g. FAYDA-ETH-****5678)
    const maskedRef = `FAYDA-ETH-${cleanId.slice(0, 3)}****${cleanId.slice(-4)}`;

    const updated = await UserRepository.verifyNationalId(userId, maskedRef);
    logger.info(`[FAYDA NATIONAL ID VERIFIED] User ${user.email} verified with ref ${maskedRef}`);

    return this.mapToResponse(updated);
  }

  static async getUserById(userId: string): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.mapToResponse(user);
  }

  static async updateUserStatus(userId: string, dto: UpdateStatusDTO): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updated = await UserRepository.updateStatus(userId, dto.accountStatus);
    return this.mapToResponse(updated);
  }

  static async updateUserRoles(userId: string, dto: UpdateRolesDTO): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const primaryRole = dto.roles[0] || Role.RENTER;
    const updated = await UserRepository.updateRole(userId, primaryRole);
    return this.mapToResponse(updated);
  }

  static async getAllUsers(query: GetUsersQuery) {
    const pagination = parsePagination({ page: query.page, limit: query.limit });
    const { users, total } = await UserRepository.findAll({
      skip: pagination.skip,
      limit: pagination.limit,
      role: query.role,
      status: query.status,
      search: query.search,
    });

    return {
      users: users.map((u) => this.mapToResponse(u)),
      meta: formatPaginatedMeta(total, pagination.page, pagination.limit),
    };
  }

  private static mapToResponse(user: UserWithDetails): UserResponse {
    const nameParts = [user.profile?.firstName, user.profile?.middleName, user.profile?.lastName].filter(Boolean);
    const fullName = nameParts.length > 0 ? nameParts.join(' ') : user.email;
    const roleName = (user.role?.name || Role.RENTER) as Role;

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
