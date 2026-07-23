import { Router } from 'express';
import { CoursesController } from './courses.controller';
import { validate } from '../../core/http/validate.middleware';
import { authMiddleware } from '../../core/http/auth.middleware';
import { createCourseSchema, updateCourseSchema } from './courses.schema';

const router = Router();
const controller = new CoursesController();

router.get('/', controller.listPublished);
router.get('/mine', authMiddleware, controller.listMine);
router.post('/', authMiddleware, validate(createCourseSchema), controller.create);
router.patch('/:id', authMiddleware, validate(updateCourseSchema), controller.update);
router.delete('/:id', authMiddleware, controller.remove);
router.get('/:slug', controller.getBySlug);

export default router;
