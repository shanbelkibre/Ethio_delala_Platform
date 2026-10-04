import { Router } from 'express';
import { MessageController } from './message.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Messaging is more sensitive — stricter limit to prevent spam
const messageRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.use(messageRateLimiter, authenticate);

router.post('/', MessageController.send);
router.get('/conversations', MessageController.getConversations);
router.get('/thread/:otherUserId', MessageController.getThread);

export default router;
