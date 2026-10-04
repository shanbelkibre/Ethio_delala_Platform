import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { uploadPublic } from '../../middleware/upload.middleware';
import {
  updateProfileSchema,
  verifyNationalIdSchema,
  updateStatusSchema,
  updateRolesSchema,
  getUsersQuerySchema,
} from './user.validation';
import { Role } from '../../constants/roles';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

const userRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

// All routes require valid JWT authentication
router.use(userRateLimiter, authenticate);

// Current Authenticated User Profile Endpoints
router.get('/me', UserController.getMe);
router.patch('/me', validateRequest(updateProfileSchema), UserController.updateMe);
router.post('/me/avatar', uploadPublic.single('file'), UserController.uploadAvatar);
router.post('/me/verify-national-id', validateRequest(verifyNationalIdSchema), UserController.verifyNationalId);
router.get('/me/properties', UserController.getMyProperties);

// Specific User Details Endpoint
router.get('/:id', UserController.getUserById);

// Admin-Only User Management Endpoints
router.get('/', authorizeRoles(Role.ADMIN), validateRequest(getUsersQuerySchema), UserController.getAllUsers);
router.patch('/:id/status', authorizeRoles(Role.ADMIN), validateRequest(updateStatusSchema), UserController.updateStatus);
router.patch('/:id/roles', authorizeRoles(Role.ADMIN), validateRequest(updateRolesSchema), UserController.updateRoles);

export default router;
