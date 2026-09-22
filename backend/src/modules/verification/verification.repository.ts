import { prisma } from '../../config/database';
import { IdentityVerification, VerificationStatus } from '@prisma/client';

export class VerificationRepository {
  static async upsertIdentityDoc(data: {
    userId: string;
    documentType?: string;
    documentNumber?: string;
    documentUrl?: string;
  }): Promise<IdentityVerification> {
    const nationalIdReference = [data.documentType, data.documentNumber, data.documentUrl]
      .filter(Boolean)
      .join(' | ');

    return prisma.identityVerification.upsert({
      where: { userId: data.userId },
      create: {
        userId: data.userId,
        nationalIdReference,
        status: VerificationStatus.PENDING,
      },
      update: {
        nationalIdReference,
        status: VerificationStatus.PENDING,
      },
    });
  }

  static async findIdentityDocById(id: string): Promise<IdentityVerification | null> {
    return prisma.identityVerification.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  static async findIdentityDocByUserId(userId: string): Promise<IdentityVerification | null> {
    return prisma.identityVerification.findUnique({
      where: { userId },
    });
  }

  static async updateIdentityStatus(
    id: string,
    status: VerificationStatus,
    _rejectionReason?: string
  ): Promise<IdentityVerification> {
    return prisma.identityVerification.update({
      where: { id },
      data: {
        status,
        nationalIdVerified: status === VerificationStatus.VERIFIED,
        verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : null,
      },
    });
  }

  static async getPendingIdentityDocs(): Promise<IdentityVerification[]> {
    return prisma.identityVerification.findMany({
      where: { status: VerificationStatus.PENDING },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async getAllIdentityDocs(): Promise<IdentityVerification[]> {
    return prisma.identityVerification.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

