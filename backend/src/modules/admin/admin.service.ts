import { prisma } from '../../config/database';
import { PropertyStatus, VerificationStatus } from '@prisma/client';

export class AdminService {
  static async getDashboardStats() {
    const [
      totalUsers,
      totalOwners,
      totalProperties,
      pendingProperties,
      pendingVerifications,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: { name: 'OWNER' } } }),
      prisma.property.count(),
      prisma.property.count({ where: { status: PropertyStatus.PENDING_REVIEW } }),
      prisma.identityVerification.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    return {
      totalUsers,
      totalOwners,
      totalProperties,
      pendingProperties,
      pendingVerifications,
      activeSubscriptions,
    };
  }

  static async logAdminAction(adminId: string, action: string, entityName: string, entityId: string, details?: any) {
    return prisma.adminAction.create({
      data: {
        adminId,
        actionType: action,
        description: `${entityName} [${entityId}] ${details ? JSON.stringify(details) : ''}`.trim(),
      },
    });
  }

  static async getAuditLogs() {
    return prisma.adminAction.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }
}

