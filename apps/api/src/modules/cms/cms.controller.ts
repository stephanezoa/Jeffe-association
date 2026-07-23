import { Request, Response, NextFunction } from 'express';
import { CmsService } from './cms.service';

export class CmsController {
  private service = new CmsService();

  public getBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.params;
      const locale = (req.query.locale as string) || 'fr';
      const content = await this.service.getContentBlock(key, locale);
      res.json({ data: { key, content } });
    } catch (err) {
      next(err);
    }
  };

  public getAllBlocks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const blocks = await this.service.getAllBlocks();
      res.json({ data: blocks });
    } catch (err) {
      next(err);
    }
  };

  public upsertBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { key, content, locale } = req.body;
      const result = await this.service.upsertContentBlock(key, content, user.id, locale || 'fr');
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public getOpportunityPlaylist = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const playlistData = await this.service.getOpportunityPlaylist();
      res.json({ data: playlistData });
    } catch (err) {
      next(err);
    }
  };
}
