"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const verification_repository_1 = require("./verification.repository");
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
class VerificationService {
    static async submitIdentityDocument(userId, documentType, documentNumber, documentUrl) {
        const doc = await verification_repository_1.VerificationRepository.upsertIdentityDoc({
            userId,
            documentType,
            documentNumber,
            documentUrl,
        });
        // Create AI Pre-check hook entry
        await this.triggerAiPrecheck('IdentityVerification', doc.id);
        return doc;
    }
    static async submitOwnerLicense(ownerId, licenseNumber, documentUrl) {
        const doc = await verification_repository_1.VerificationRepository.upsertIdentityDoc({
            userId: ownerId,
            documentType: 'LICENSE',
            documentNumber: licenseNumber,
            documentUrl,
        });
        // Create AI Pre-check hook entry
        await this.triggerAiPrecheck('OwnerLicense', doc.id);
        return doc;
    }
    static async reviewIdentityDocument(docId, dto) {
        const doc = await verification_repository_1.VerificationRepository.findIdentityDocById(docId);
        if (!doc) {
            throw new errors_1.NotFoundError('Identity verification document not found');
        }
        const updatedDoc = await verification_repository_1.VerificationRepository.updateIdentityStatus(docId, dto.status, dto.rejectionReason);
        return updatedDoc;
    }
    static async reviewLicenseDocument(licenseId, dto) {
        return this.reviewIdentityDocument(licenseId, dto);
    }
    static async getPendingSubmissions() {
        const identities = await verification_repository_1.VerificationRepository.getPendingIdentityDocs();
        return { identities, licenses: [] };
    }
    static async triggerAiPrecheck(entityType, entityId) {
        // Simulated AI Document Pre-check (calculates initial risk score based on document heuristic)
        const riskScore = Math.floor(Math.random() * 20); // Low risk score (0-20) for standard submission
        await database_1.prisma.aIVerification.create({
            data: {
                entityType,
                entityId,
                riskScore,
                ocrData: JSON.stringify({ extractedStatus: 'VALID_FORMAT', timestamp: new Date().toISOString() }),
                warnings: JSON.stringify([]),
                recommendation: riskScore > 50 ? 'MANUAL_REVIEW_REQUIRED' : 'AUTO_VERIFICATION_RECOMMENDED',
            },
        });
    }
}
exports.VerificationService = VerificationService;
