import { Router } from 'express';
import { StatsController } from './stats.controller';

const router = Router();

router.get('/', StatsController.getPublicStats);

export default router;
