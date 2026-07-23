import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../errors/app-error';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Jeton d\'authentification manquant'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return next(AppError.unauthorized('Jeton d\'accès invalide ou expiré', 'AUTH_INVALID_TOKEN'));
  }
}
