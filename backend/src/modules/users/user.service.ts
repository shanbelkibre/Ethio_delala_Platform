import { UserRepository, UserWithDetails } from './user.repository';
import { NotFoundError } from '../../utils/errors';
import { UpdateProfileDTO, UpdateRolesDTO, UserResponse } from './user.types';
import { parsePagination, formatPaginatedMeta } from '../../utils/pagination';

export class UserService {
  static async getProfile(userId: string): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.mapToResponse(user);
  }

  static async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let firstName: string | undefined;
    let lastName: string | undefined;

    if (dto.name) {
      const parts = dto.name.trim().split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || undefined;
    }

    const updated = await UserRepository.updateProfile(userId, {
      phone: dto.phone,
      firstName,
      lastName,
      profileImage: dto.avatarUrl,
    });

    return this.mapToResponse(updated);
  }

  static async updateUserRoles(userId: string, dto: UpdateRolesDTO): Promise<UserResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const primaryRole = dto.roles[0] || 'RENTER';
    const updated = await UserRepository.updateRole(userId, primaryRole);
    return this.mapToResponse(updated);
  }

  static async getAllUsers(page = 1, limit = 10) {
    const pagination = parsePagination({ page, limit });
    const { users, total } = await UserRepository.findAll(pagination.skip, pagination.limit);

    return {
      users: users.map((u) => this.mapToResponse(u)),
      meta: formatPaginatedMeta(total, pagination.page, pagination.limit),
    };
  }

  private static mapToResponse(user: UserWithDetails): UserResponse {
    const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email;
    const roleName = (user.role?.name || 'RENTER') as any;

    return {
      id: user.id,
      name: fullName,
      email: user.email,
      phone: user.phone,
      roles: [roleName],
      avatarUrl: user.profile?.profileImage || null,
      isPhoneVerified: user.identityVerification?.phoneOtpVerified || false,
      isEmailVerified: user.identityVerification?.emailVerified || false,
      isIdentityVerified: user.identityVerification?.nationalIdVerified || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

