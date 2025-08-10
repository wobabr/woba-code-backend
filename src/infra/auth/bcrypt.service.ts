import bcrypt from 'bcryptjs';
import { HashService } from '@services/hash-service.interface';

export class BcryptService implements HashService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
} 