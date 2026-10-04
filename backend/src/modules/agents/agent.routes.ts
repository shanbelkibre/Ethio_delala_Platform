import { Router } from 'express';
import { AgentController } from './agent.controller';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Public endpoint to retrieve verified agents from database
const publicRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

router.get('/', publicRateLimiter, AgentController.getPublicAgents);

export default router;
