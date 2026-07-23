import { Router } from 'express';
import { EventsController } from './events.controller';
import { validate } from '../../core/http/validate.middleware';
import { authMiddleware } from '../../core/http/auth.middleware';
import { createEventSchema, updateEventSchema } from './events.schema';

const router = Router();
const controller = new EventsController();

router.get('/', controller.listPublished);
router.get('/mine', authMiddleware, controller.listMine);
router.post('/', authMiddleware, validate(createEventSchema), controller.create);
router.patch('/:id', authMiddleware, validate(updateEventSchema), controller.update);
router.delete('/:id', authMiddleware, controller.remove);

export default router;
