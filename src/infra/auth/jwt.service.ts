import jwt from 'jsonwebtoken';
import { TokenService } from '@services/token-service.interface';
import { ConfigService } from '@shared/config/app.config';

export class JwtService implements TokenService {
  private config = ConfigService.get();

  sign(payload: object): string {
    return jwt.sign(payload, this.config.jwtSecret, { expiresIn: '1h' });
  }

  verify(token: string): any {
    return jwt.verify(token, this.config.jwtSecret);
  }
} 