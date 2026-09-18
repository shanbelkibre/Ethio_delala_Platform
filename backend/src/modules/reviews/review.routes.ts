import { Router } from 'express';
import { ReviewController } from './review.controller';

const router = Router();

router.get('/', ReviewController.getPublicReviews);
router.get('/public', ReviewController.getPublicReviews);

export default router;
