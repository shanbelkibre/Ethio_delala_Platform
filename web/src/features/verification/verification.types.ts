export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IdentityVerification {
  id: string;
  userId: string;
  documentType: string;
  documentUrl: string;
  status: VerificationStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface OwnerLicenseVerification {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseDocumentUrl: string;
  status: VerificationStatus;
  reviewedAt?: string;
  createdAt: string;
}

export interface PropertyKartaVerification {
  id: string;
  propertyId: string;
  kartaDocumentUrl: string;
  status: VerificationStatus;
  reviewedAt?: string;
  createdAt: string;
}
