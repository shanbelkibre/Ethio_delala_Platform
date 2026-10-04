import { Router } from 'express';
import { SearchController } from './search.controller';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Public search — higher limit since it is the main discovery endpoint
const searchRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

router.get('/', searchRateLimiter, SearchController.search);

export default router;
