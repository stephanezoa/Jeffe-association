import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage, logger } from './index';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  res.setHeader('X-Request-Id', requestId);
  (req as any).requestId = requestId;

  asyncLocalStorage.run({ requestId }, () => {
    const start = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - start;
      logger.info({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs,
      }, `${req.method} ${req.originalUrl} finished in ${durationMs}ms`);
    });
    next();
  });
}
