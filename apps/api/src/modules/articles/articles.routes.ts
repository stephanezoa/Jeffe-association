import { Router } from 'express';
import { ArticlesController } from './articles.controller';
import { validate } from '../../core/http/validate.middleware';
import { authMiddleware } from '../../core/http/auth.middleware';
import { createArticleSchema, updateArticleSchema } from './articles.schema';

const router = Router();
const controller = new ArticlesController();

// Routes publiques
router.get('/', controller.listPublished);

// Routes authentifiées (auteur) — déclarées avant /:slug pour éviter la collision
router.get('/mine', authMiddleware, controller.listMine);
router.post('/', authMiddleware, validate(createArticleSchema), controller.create);
router.patch('/:id', authMiddleware, validate(updateArticleSchema), controller.update);
router.delete('/:id', authMiddleware, controller.remove);

// Détail public par slug (en dernier : capte le reste)
router.get('/:slug', controller.getBySlug);

export default router;
