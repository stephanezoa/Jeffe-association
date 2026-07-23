import { Request, Response, NextFunction } from 'express';
import { ArticlesService } from './articles.service';

export class ArticlesController {
  private service = new ArticlesService();

  public listPublished = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ data: await this.service.listPublished() });
    } catch (err) {
      next(err);
    }
  };

  public getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ data: await this.service.getPublishedBySlug(req.params.slug) });
    } catch (err) {
      next(err);
    }
  };

  public listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      res.json({ data: await this.service.listMine(user.id) });
    } catch (err) {
      next(err);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const article = await this.service.create(user.id, req.body);
      res.status(201).json({ data: article });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const article = await this.service.update(req.params.id, user.id, req.body);
      res.json({ data: article });
    } catch (err) {
      next(err);
    }
  };

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      res.json({ data: await this.service.remove(req.params.id, user.id) });
    } catch (err) {
      next(err);
    }
  };
}
