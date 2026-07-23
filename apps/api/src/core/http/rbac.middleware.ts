import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export function requirePermission(requiredPermission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(AppError.unauthorized('Utilisateur non authentifié'));
    }

    const permissions: string[] = user.permissions || [];
    const roles: string[] = user.roles || [];

    if (roles.includes('super_admin')) {
      return next();
    }

    if (!permissions.includes(requiredPermission)) {
      return next(AppError.forbidden(`Permission requise: ${requiredPermission}`, 'PERMISSION_DENIED'));
    }

    next();
  };
}
