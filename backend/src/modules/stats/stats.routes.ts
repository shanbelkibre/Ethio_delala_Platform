import { Router } from 'express';
import { StatsController } from './stats.controller';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Public stats — cached data, moderate limit
const publicRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

router.get('/', publicRateLimiter, StatsController.getPublicStats);

export default router;
