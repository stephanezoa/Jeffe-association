import { Router } from 'express';
import { z } from 'zod';
import { MembersController } from './members.controller';
import { validate } from '../../core/http/validate.middleware';
import { authMiddleware } from '../../core/http/auth.middleware';

const router = Router();
const controller = new MembersController();

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    email: z.string().email().max(255).optional(),
    phone: z.string().max(50).optional(),
  }),
});

router.use(authMiddleware);
router.get('/me', controller.me);
router.patch('/me', validate(updateProfileSchema), controller.updateMe);

export default router;
