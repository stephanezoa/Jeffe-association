import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Réinjecte la version validée pour que les valeurs par défaut et les
      // coercions de Zod prennent effet (req.query/params sont en lecture seule
      // sur certaines versions d'Express, on ne réaffecte donc que le body).
      if (parsed && typeof parsed === 'object' && 'body' in parsed) {
        req.body = (parsed as { body: unknown }).body;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
