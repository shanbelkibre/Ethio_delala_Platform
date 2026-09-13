"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
class AdminService {
    static async getDashboardStats() {
        const [totalUsers, totalOwners, totalProperties, pendingProperties, pendingVerifications, activeSubscriptions,] = await Promise.all([
            database_1.prisma.user.count(),
            database_1.prisma.user.count({ where: { role: { name: 'OWNER' } } }),
            database_1.prisma.property.count(),
            database_1.prisma.property.count({ where: { status: client_1.PropertyStatus.DRAFT } }),
            database_1.prisma.identityVerification.count({ where: { status: client_1.VerificationStatus.PENDING } }),
            database_1.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
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
    static async logAdminAction(adminId, action, entityName, entityId, details) {
        return database_1.prisma.adminAction.create({
            data: {
                adminId,
                actionType: action || 'UPDATE_SETTINGS',
                description: `${entityName} [${entityId}] ${details ? JSON.stringify(details) : ''}`.trim(),
            },
        });
    }
    static async getAuditLogs() {
        return database_1.prisma.adminAction.findMany({
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
exports.AdminService = AdminService;
