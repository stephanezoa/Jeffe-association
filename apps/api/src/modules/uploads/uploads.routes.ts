import { Router } from 'express';
import { UploadsController } from './uploads.controller';
import { authMiddleware } from '../../core/http/auth.middleware';

const router = Router();
const controller = new UploadsController();

router.post('/', authMiddleware, controller.upload);

export default router;
