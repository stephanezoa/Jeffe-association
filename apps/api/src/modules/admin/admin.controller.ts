import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';

export class AdminController {
  private service = new AdminService();

  public getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.service.getDashboardStats();
      res.json({ data: stats });
    } catch (err) {
      next(err);
    }
  };

  public getMembersList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string;
      const result = await this.service.getMembersList(page, limit, search);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public updateMemberStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { memberId, status, reason } = req.body;
      const result = await this.service.updateMemberStatus(memberId, status, user.id, reason);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public grantPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { memberId, permissionKey } = req.body;
      const result = await this.service.grantPermissionToAdmin(memberId, permissionKey, user.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public getModerationQueue = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const queue = await this.service.getModerationQueue();
      res.json({ data: queue });
    } catch (err) {
      next(err);
    }
  };

  public reviewModerationItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { status, comment } = req.body;
      const result = await this.service.reviewModerationItem(id, status, user.id, comment);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const result = await this.service.getAuditLogs(page, limit);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}
