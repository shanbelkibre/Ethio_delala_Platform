import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createPlanSchema, updatePlanSchema, subscribeSchema } from './subscription.validation';
import { Role } from '../../constants/roles';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Rate limiters
const publicRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });
const subscriptionRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Public Plan Listing Endpoint
router.get('/plans', publicRateLimiter, SubscriptionController.getPlans);

// Authenticated Endpoints
router.use(subscriptionRateLimiter, authenticate);

router.get('/my-subscription', authorizeRoles(Role.OWNER, Role.ADMIN), SubscriptionController.getMySubscription);
router.post('/subscribe', authorizeRoles(Role.OWNER, Role.ADMIN), validateRequest(subscribeSchema), SubscriptionController.subscribe);
router.post('/confirm-payment', SubscriptionController.confirmPayment);

// Admin-only Plan Management Endpoints
router.get('/all-plans', authorizeRoles(Role.ADMIN), SubscriptionController.getAllPlans);
router.post('/plans', authorizeRoles(Role.ADMIN), validateRequest(createPlanSchema), SubscriptionController.createPlan);
router.patch('/plans/:id', authorizeRoles(Role.ADMIN), validateRequest(updatePlanSchema), SubscriptionController.updatePlan);

export default router;
