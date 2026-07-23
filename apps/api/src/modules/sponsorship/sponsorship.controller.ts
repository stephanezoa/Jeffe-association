import { Request, Response, NextFunction } from 'express';
import { SponsorshipService } from './sponsorship.service';

export class SponsorshipController {
  private service = new SponsorshipService();

  public createInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.service.createInvitation(user.id, req.body, req.ip || '127.0.0.1');
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.params.token;
      const result = await this.service.validateInvitationToken(token);
      res.json({ data: { valid: true, sponsorName: `${result.sponsor?.firstName} ${result.sponsor?.lastName}` } });
    } catch (err) {
      next(err);
    }
  };

  public getTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const depth = Number(req.query.depth) || 2;
      const rootId = req.query.rootId as string;
      const result = await this.service.getTree(user.id, rootId, depth);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public getDownline = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const result = await this.service.getDownline(user.id, page, limit, { status, search });
      res.json({ data: result.results, meta: { total: result.total, page, limit } });
    } catch (err) {
      next(err);
    }
  };

  public getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.service.getStats(user.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}
