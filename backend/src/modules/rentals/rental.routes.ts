import { Router } from 'express';
import { RentalController } from './rental.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createRentalRequestSchema, respondRentalRequestSchema } from './rental.validation';
import { Role } from '../../constants/roles';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

const rentalRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.use(rentalRateLimiter, authenticate);

router.post(
  '/request',
  authorizeRoles(Role.RENTER, Role.BUYER, Role.ADMIN),
  validateRequest(createRentalRequestSchema),
  RentalController.submit
);

router.get('/my-requests', RentalController.getMyRequests);
router.get('/owner-requests', authorizeRoles(Role.OWNER, Role.ADMIN), RentalController.getOwnerRequests);
router.patch(
  '/:id/respond',
  authorizeRoles(Role.OWNER, Role.ADMIN),
  validateRequest(respondRentalRequestSchema),
  RentalController.respond
);

export default router;
