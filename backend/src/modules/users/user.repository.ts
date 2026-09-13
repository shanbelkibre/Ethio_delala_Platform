import { prisma, withReconnect } from '../../config/database';
import { Prisma, AccountStatus, VerificationStatus } from '@prisma/client';
import { Role } from '../../constants/roles';

export const userInclude = {
  role: true,
  profile: true,
  identityVerification: true,
} as const;

export type UserWithDetails = Prisma.UserGetPayload<{ include: typeof userInclude }>;

export class UserRepository {
  static async findById(id: string): Promise<UserWithDetails | null> {
    return withReconnect(() =>
      prisma.user.findUnique({
        where: { id },
        include: userInclude,
      })
    );
  }

  static async findByEmail(email: string): Promise<UserWithDetails | null> {
    return withReconnect(() =>
      prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: userInclude,
      })
    );
  }

  static async findByPhone(phone: string): Promise<UserWithDetails | null> {
    return withReconnect(() =>
      prisma.user.findUnique({
        where: { phone },
        include: userInclude,
      })
    );
  }

  static async updateProfile(
    userId: string,
    data: {
      phone?: string;
      firstName?: string;
      middleName?: string;
      lastName?: string;
      gender?: string;
      dateOfBirth?: Date;
      maritalStatus?: string;
      profileImageUrl?: string;
      region?: string;
      zone?: string;
      wereda?: string;
      kebele?: string;
    }
  ): Promise<UserWithDetails> {
    const { phone, ...profileData } = data;

    return withReconnect(() =>
      prisma.user.update({
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
        include: userInclude,
      })
    );
  }

  static async verifyNationalId(
    userId: string,
    nationalIdReference: string
  ): Promise<UserWithDetails> {
    const now = new Date();

    return withReconnect(() =>
      prisma.user.update({
        where: { id: userId },
        data: {
          identityVerification: {
            upsert: {
              create: {
                nationalIdReference,
                nationalIdVerified: true,
                nationalIdVerifiedAt: now,
                status: VerificationStatus.VERIFIED,
                verifiedAt: now,
              },
              update: {
                nationalIdReference,
                nationalIdVerified: true,
                nationalIdVerifiedAt: now,
                status: VerificationStatus.VERIFIED,
                verifiedAt: now,
                rejectionReason: null,
              },
            },
          },
        },
        include: userInclude,
      })
    );
  }

  static async updateStatus(userId: string, accountStatus: AccountStatus): Promise<UserWithDetails> {
    return withReconnect(() =>
      prisma.user.update({
        where: { id: userId },
        data: { accountStatus },
        include: userInclude,
      })
    );
  }

  static async updateRole(userId: string, roleName: Role): Promise<UserWithDetails> {
    const roleRecord = await prisma.role.findUnique({ where: { name: roleName } });
    if (!roleRecord) {
      throw new Error(`Role ${roleName} does not exist`);
    }

    return withReconnect(() =>
      prisma.user.update({
        where: { id: userId },
        data: { roleId: roleRecord.id },
        include: userInclude,
      })
    );
  }

  static async findAll(params: {
    skip?: number;
    limit?: number;
    role?: Role;
    status?: AccountStatus;
    search?: string;
  }): Promise<{ users: UserWithDetails[]; total: number }> {
    const { skip = 0, limit = 10, role, status, search } = params;

    const where: Prisma.UserWhereInput = {
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
      withReconnect(() =>
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: userInclude,
        })
      ),
      withReconnect(() => prisma.user.count({ where })),
    ]);

    return { users, total };
  }
}
