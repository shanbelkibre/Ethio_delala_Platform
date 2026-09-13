import { prisma } from '../../config/database';
import { User, Prisma } from '@prisma/client';

export const userInclude = {
  role: true,
  profile: true,
  identityVerification: true,
} as const;

export type UserWithDetails = Prisma.UserGetPayload<{ include: typeof userInclude }>;

export class UserRepository {
  static async findById(id: string): Promise<UserWithDetails | null> {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  }

  static async findByEmail(email: string): Promise<UserWithDetails | null> {
    return prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput): Promise<UserWithDetails> {
    return prisma.user.update({
      where: { id },
      data,
      include: userInclude,
    });
  }

  static async updateProfile(id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
  }): Promise<UserWithDetails> {
    const { phone, firstName, lastName, profileImage } = data;
    return prisma.user.update({
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
      include: userInclude,
    });
  }

  static async updateRole(id: string, roleName: string): Promise<UserWithDetails> {
    const roleRecord = await prisma.role.findUnique({ where: { name: roleName as any } });
    if (!roleRecord) {
      throw new Error(`Role ${roleName} not found`);
    }
    return prisma.user.update({
      where: { id },
      data: {
        roleId: roleRecord.id,
      },
      include: userInclude,
    });
  }

  static async findAll(skip = 0, limit = 10): Promise<{ users: UserWithDetails[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: userInclude,
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }
}

