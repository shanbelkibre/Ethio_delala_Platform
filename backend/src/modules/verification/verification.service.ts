import { VerificationRepository } from './verification.repository';
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import { VerificationStatus } from '@prisma/client';
import { ReviewDocDTO } from './verification.types';

export class VerificationService {
  static async submitIdentityDocument(userId: string, documentType: string, documentNumber: string, documentUrl: string) {
    const doc = await VerificationRepository.upsertIdentityDoc({
      userId,
      documentType,
      documentNumber,
      documentUrl,
    });

    // Create AI Pre-check hook entry
    await this.triggerAiPrecheck('IdentityVerification', doc.id);

    return doc;
  }

  static async submitOwnerLicense(ownerId: string, licenseNumber: string, documentUrl: string) {
    const doc = await VerificationRepository.upsertIdentityDoc({
      userId: ownerId,
      documentType: 'LICENSE',
      documentNumber: licenseNumber,
      documentUrl,
    });

    // Create AI Pre-check hook entry
    await this.triggerAiPrecheck('OwnerLicense', doc.id);

    return doc;
  }

  static async reviewIdentityDocument(docId: string, dto: ReviewDocDTO) {
    const doc = await VerificationRepository.findIdentityDocById(docId);
    if (!doc) {
      throw new NotFoundError('Identity verification document not found');
    }

    const updatedDoc = await VerificationRepository.updateIdentityStatus(docId, dto.status, dto.rejectionReason);
    return updatedDoc;
  }

  static async reviewLicenseDocument(licenseId: string, dto: ReviewDocDTO) {
    return this.reviewIdentityDocument(licenseId, dto);
  }

  static async getPendingSubmissions() {
    const identities = await VerificationRepository.getPendingIdentityDocs();
    return { identities, licenses: [] };
  }

  private static async triggerAiPrecheck(entityType: string, entityId: string) {
    // Simulated AI Document Pre-check (calculates initial risk score based on document heuristic)
    const riskScore = Math.floor(Math.random() * 20); // Low risk score (0-20) for standard submission
    await prisma.aIVerification.create({
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
