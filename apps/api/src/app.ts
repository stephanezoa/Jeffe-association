import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './core/config/env';
import { requestIdMiddleware } from './core/logger/request-id.middleware';
import { errorHandler } from './core/errors/error-handler';

// Modules
import { authRouter } from './modules/auth';
import { sponsorshipRouter } from './modules/sponsorship';
import { cmsRouter } from './modules/cms';
import { newsletterRouter } from './modules/newsletter';
import { adminRouter } from './modules/admin';
import { articlesRouter } from './modules/articles';
import { coursesRouter } from './modules/courses';
import { eventsRouter } from './modules/events';
import { uploadsRouter } from './modules/uploads';
import { contactRouter } from './modules/contact';
import { membersRouter } from './modules/members';

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: true, credentials: true }));
// Limite relevée : les uploads d'image transitent en data URL base64 (~1 Mo).
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(requestIdMiddleware);

// Fichiers uploadés (images de couverture), servis en statique.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Healthchecks
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API V1 Routes
const prefix = env.API_PREFIX;
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/members`, membersRouter);
app.use(`${prefix}/sponsorship`, sponsorshipRouter);
app.use(`${prefix}/cms`, cmsRouter);
app.use(`${prefix}/newsletter`, newsletterRouter);
app.use(`${prefix}/admin`, adminRouter);
app.use(`${prefix}/articles`, articlesRouter);
app.use(`${prefix}/courses`, coursesRouter);
app.use(`${prefix}/events`, eventsRouter);
app.use(`${prefix}/uploads`, uploadsRouter);
app.use(`${prefix}/contact`, contactRouter);

// Global Error Handler
app.use(errorHandler);
