import { Request, Response, NextFunction } from 'express';
import { NewsletterService } from './newsletter.service';

export class NewsletterController {
  private service = new NewsletterService();

  public subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: { message: 'L\'email est obligatoire' } });
      const result = await this.service.subscribe(email);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public getSubscribers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscribers = await this.service.getSubscribers();
      res.json({ data: subscribers });
    } catch (err) {
      next(err);
    }
  };

  public createCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { subject, content } = req.body;
      const campaign = await this.service.createCampaign(subject, content, user.id);
      res.status(201).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  };

  public sendCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const result = await this.service.sendCampaign(id, user.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}
