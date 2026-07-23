import { Router } from 'express';
import { z } from 'zod';
import { ContactController } from './contact.controller';
import { validate } from '../../core/http/validate.middleware';

const router = Router();
const controller = new ContactController();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    email: z.string().email().max(255),
    phone: z.string().max(50).optional(),
    subject: z.string().min(3).max(255),
    message: z.string().min(10).max(5000),
  }),
});

// Formulaire de contact public
router.post('/', validate(contactSchema), controller.submit);

export default router;
