import { Router } from 'express';
import { VerificationController } from './verification.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { uploadPrivate } from '../../middleware/upload.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { submitIdentitySchema, submitLicenseSchema, reviewDocSchema } from './verification.validation';
import { Role } from '../../constants/roles';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Verification involves file uploads & DB writes — strict limit
const verificationRateLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }); // 10 per hour

router.use(verificationRateLimiter, authenticate);

// User Submission Endpoints
router.post(
  '/identity',
  uploadPrivate.single('document'),
  validateRequest(submitIdentitySchema),
  VerificationController.uploadIdentity
);

router.post(
  '/license',
  authorizeRoles(Role.OWNER, Role.ADMIN),
  uploadPrivate.single('document'),
  validateRequest(submitLicenseSchema),
  VerificationController.uploadLicense
);

// Admin Review Endpoints
router.get('/pending', authorizeRoles(Role.ADMIN), VerificationController.getPending);
router.get('/all', authorizeRoles(Role.ADMIN), VerificationController.getAll);
router.patch('/identity/:id/review', authorizeRoles(Role.ADMIN), validateRequest(reviewDocSchema), VerificationController.reviewIdentity);
router.patch('/license/:id/review', authorizeRoles(Role.ADMIN), validateRequest(reviewDocSchema), VerificationController.reviewLicense);

export default router;
