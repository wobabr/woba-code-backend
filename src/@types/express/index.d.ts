import 'express';
import { User } from '@entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
    user?: User;
    requestId?: string;
  }
}