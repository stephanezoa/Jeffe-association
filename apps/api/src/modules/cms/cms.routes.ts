import { Router } from 'express';
import { CmsController } from './cms.controller';
import { authMiddleware } from '../../core/http/auth.middleware';
import { requirePermission } from '../../core/http/rbac.middleware';

const router = Router();
const controller = new CmsController();

// Routes publiques
router.get('/blocks/:key', controller.getBlock);
router.get('/opportunity-playlist', controller.getOpportunityPlaylist);

// Routes admin
router.use(authMiddleware);
router.get('/blocks', requirePermission('cms.edit'), controller.getAllBlocks);
router.post('/blocks', requirePermission('cms.edit'), controller.upsertBlock);

export default router;
