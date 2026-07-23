import { Request, Response, NextFunction } from 'express';
import { EventsService } from './events.service';

export class EventsController {
  private service = new EventsService();

  public listPublished = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ data: await this.service.listPublished() });
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
      res.status(201).json({ data: await this.service.create(user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      res.json({ data: await this.service.update(req.params.id, user.id, req.body) });
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
