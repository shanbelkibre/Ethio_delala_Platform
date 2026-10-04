import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { rateLimit } from '../../middleware/rate-limit.middleware';
import { createPlanSchema, updatePlanSchema, subscribeSchema } from './subscription.validation';
import { Role } from '../../constants/roles';

const router = Router();
const subscriptionRateLimiter = rateLimit();

// Public Plan Listing Endpoint
router.get('/plans', SubscriptionController.getPlans);

// Authenticated Endpoints
router.get('/my-subscription', subscriptionRateLimiter, authenticate, authorizeRoles(Role.OWNER, Role.ADMIN), SubscriptionController.getMySubscription);
router.post('/subscribe', subscriptionRateLimiter, authenticate, authorizeRoles(Role.OWNER, Role.ADMIN), validateRequest(subscribeSchema), SubscriptionController.subscribe);
router.post('/confirm-payment', subscriptionRateLimiter, authenticate, SubscriptionController.confirmPayment);

// Admin-only Plan Management Endpoints
router.get('/all-plans', subscriptionRateLimiter, authenticate, authorizeRoles(Role.ADMIN), SubscriptionController.getAllPlans);
router.post('/plans', subscriptionRateLimiter, authenticate, authorizeRoles(Role.ADMIN), validateRequest(createPlanSchema), SubscriptionController.createPlan);
router.patch('/plans/:id', subscriptionRateLimiter, authenticate, authorizeRoles(Role.ADMIN), validateRequest(updatePlanSchema), SubscriptionController.updatePlan);

export default router;
