import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import { authMiddleware } from '../../core/http/auth.middleware';
import { requirePermission } from '../../core/http/rbac.middleware';

const router = Router();
const controller = new NewsletterController();

// Route publique d'inscription newsletter
router.post('/subscribe', controller.subscribe);

// Routes admin
router.use(authMiddleware);
router.get('/subscribers', requirePermission('newsletter.manage'), controller.getSubscribers);
router.post('/campaigns', requirePermission('newsletter.manage'), controller.createCampaign);
router.post('/campaigns/:id/send', requirePermission('newsletter.manage'), controller.sendCampaign);

export default router;
