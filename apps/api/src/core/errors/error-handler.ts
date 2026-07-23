import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error';
import { logger } from '../logger';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const requestId = (req as any).requestId;

  if (err instanceof AppError) {
    logger.warn({ err, requestId }, `[${err.code}] ${err.message}`);
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
  }

  if (err instanceof ZodError) {
    logger.warn({ err: err.errors, requestId }, `[VALIDATION_ERROR] Request validation failed`);
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données de requête invalides',
        details: err.errors,
        requestId,
      },
    });
  }

  logger.error({ err, requestId }, `[INTERNAL_SERVER_ERROR] ${err.message || 'Une erreur inattendue est survenue'}`);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erreur interne du serveur',
      requestId,
    },
  });
}
