import { Router } from 'express';
import { FavoriteController } from './favorite.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

const favoriteRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

router.use(favoriteRateLimiter, authenticate);

router.get('/', FavoriteController.getMyFavorites);
router.post('/:propertyId', FavoriteController.add);
router.delete('/:propertyId', FavoriteController.remove);

export default router;
