import { Request, Response, NextFunction } from 'express';
import { ContactService } from './contact.service';

export class ContactController {
  private service = new ContactService();

  public submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ data: await this.service.submit(req.body) });
    } catch (err) {
      next(err);
    }
  };
}
