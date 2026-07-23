import { Request, Response, NextFunction } from 'express';
import { MembersService } from './members.service';

export class MembersController {
  private service = new MembersService();

  public me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      res.json({ data: await this.service.getProfile(user.id) });
    } catch (err) {
      next(err);
    }
  };

  public updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      res.json({ data: await this.service.updateProfile(user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };
}
