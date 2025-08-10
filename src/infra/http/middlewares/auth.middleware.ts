import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { TokenService } from '@services/token-service.interface';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const [, token] = authHeader.split(' ');
  const tokenService = container.resolve<TokenService>('TokenService');

  try {
    const payload = tokenService.verify(token);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
} 