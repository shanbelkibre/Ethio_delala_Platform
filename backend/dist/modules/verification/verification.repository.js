"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRepository = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
class VerificationRepository {
    static async upsertIdentityDoc(data) {
        const nationalIdReference = [data.documentType, data.documentNumber, data.documentUrl]
            .filter(Boolean)
            .join(' | ');
        return database_1.prisma.identityVerification.upsert({
            where: { userId: data.userId },
            create: {
                userId: data.userId,
                nationalIdReference,
                status: client_1.VerificationStatus.PENDING,
            },
            update: {
                nationalIdReference,
                status: client_1.VerificationStatus.PENDING,
            },
        });
    }
    static async findIdentityDocById(id) {
        return database_1.prisma.identityVerification.findUnique({
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
    static async findIdentityDocByUserId(userId) {
        return database_1.prisma.identityVerification.findUnique({
            where: { userId },
        });
    }
    static async updateIdentityStatus(id, status, _rejectionReason) {
        return database_1.prisma.identityVerification.update({
            where: { id },
            data: {
                status,
                nationalIdVerified: status === client_1.VerificationStatus.VERIFIED,
                verifiedAt: status === client_1.VerificationStatus.VERIFIED ? new Date() : null,
            },
        });
    }
    static async getPendingIdentityDocs() {
        return database_1.prisma.identityVerification.findMany({
            where: { status: client_1.VerificationStatus.PENDING },
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
}
exports.VerificationRepository = VerificationRepository;
