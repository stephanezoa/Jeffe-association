import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private service = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.registerWithInvitation(req.body, req.ip || '127.0.0.1');

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password, req.ip || '127.0.0.1');

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  public logout = async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.json({ data: { message: 'Déconnexion réussie' } });
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const { currentPassword, newPassword } = req.body;
      const result = await this.service.changePassword(user.id, currentPassword, newPassword);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}
