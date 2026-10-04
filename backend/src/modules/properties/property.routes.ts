import { Router } from 'express';
import { PropertyController } from './property.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createPropertySchema, updatePropertySchema } from './property.validation';
import { Role } from '../../constants/roles';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Rate limiters
const publicRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });  // 100 req/15min for browsing
const writeRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });    // 30 req/15min for writes

// Public Property Endpoints
router.get('/published', publicRateLimiter, PropertyController.getPublished);
router.get('/', publicRateLimiter, PropertyController.getPublished);
router.get('/:id', publicRateLimiter, PropertyController.getById);

// Authenticated Endpoints
router.use(writeRateLimiter, authenticate);

// Creation guarded by subscription & role
router.post(
  '/',
  authorizeRoles(Role.OWNER, Role.ADMIN),
  validateRequest(createPropertySchema),
  PropertyController.create
);

router.patch(
  '/:id',
  authorizeRoles(Role.OWNER, Role.ADMIN),
  validateRequest(updatePropertySchema),
  PropertyController.update
);

// Admin-only Approval Status Update
router.patch(
  '/:id/status',
  authorizeRoles(Role.ADMIN),
  PropertyController.updateStatus
);

export default router;
