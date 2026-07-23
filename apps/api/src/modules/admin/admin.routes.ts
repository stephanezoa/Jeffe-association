import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware } from '../../core/http/auth.middleware';
import { requirePermission } from '../../core/http/rbac.middleware';

const router = Router();
const controller = new AdminController();

router.use(authMiddleware);

router.get('/dashboard/stats', requirePermission('admin.dashboard'), controller.getDashboardStats);
router.get('/members', requirePermission('members.manage'), controller.getMembersList);
router.post('/members/status', requirePermission('members.manage'), controller.updateMemberStatus);
router.get('/moderation/queue', requirePermission('admin.dashboard'), controller.getModerationQueue);
router.post('/moderation/:id/review', requirePermission('admin.dashboard'), controller.reviewModerationItem);
router.post('/permissions/grant', requirePermission('members.manage'), controller.grantPermission);
router.get('/audit-logs', requirePermission('admin.dashboard'), controller.getAuditLogs);

export default router;
