import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../core/http/validate.middleware';
import { authMiddleware } from '../../core/http/auth.middleware';
import { registerWithTokenSchema } from '@vestige/shared';
import { z } from 'zod';

const router = Router();
const controller = new AuthController();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const registerSchema = z.object({
  body: registerWithTokenSchema,
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

// Interdiction stricte d'auto-inscription sans invitation
router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.get('/me', authMiddleware, controller.me);
router.post('/change-password', authMiddleware, validate(changePasswordSchema), controller.changePassword);

export default router;
