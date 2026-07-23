import { Router } from 'express';
import { SponsorshipController } from './sponsorship.controller';
import { authMiddleware } from '../../core/http/auth.middleware';
import { requirePermission } from '../../core/http/rbac.middleware';

const router = Router();
const controller = new SponsorshipController();

// Route publique de validation d'un token d'invitation
router.get('/invitations/validate/:token', controller.validateToken);

// Routes protégées membres
router.use(authMiddleware);

router.post('/invitations', requirePermission('sponsorship.invite'), controller.createInvitation);
router.get('/tree', controller.getTree);
router.get('/downline', controller.getDownline);
router.get('/stats', controller.getStats);

export default router;
