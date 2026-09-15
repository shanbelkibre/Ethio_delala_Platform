import { Router } from 'express';
import { AgentController } from './agent.controller';

const router = Router();

// Public endpoint to retrieve verified agents from database
router.get('/', AgentController.getPublicAgents);

export default router;
