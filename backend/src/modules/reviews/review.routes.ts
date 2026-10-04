import { Router } from 'express';
import { ReviewController } from './review.controller';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

const publicRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

router.get('/', publicRateLimiter, ReviewController.getPublicReviews);
router.get('/public', publicRateLimiter, ReviewController.getPublicReviews);

export default router;
