import { Router } from 'express';
import { CmsController } from './cms.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { Role } from '../../constants/roles';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

const publicRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });
const writeRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Publicly readable
router.get('/', publicRateLimiter, CmsController.getConfig);

// Admin-only updates
router.patch('/', writeRateLimiter, authenticate, authorizeRoles(Role.ADMIN), CmsController.updateConfig);

export default router;
