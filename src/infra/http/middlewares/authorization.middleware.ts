import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UserRepository } from '@repositories/user-repository.interface';
import { UserRole } from '@entities/user.entity';
import { AuthorizationError } from '@infra/http/errors/http.error';

export function requireRole(allowedRoles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AuthorizationError('User not authenticated');
      }
      const userRepository = container.resolve<UserRepository>('UserRepository');
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AuthorizationError('User not found');
      }
      if (!allowedRoles.includes(user.role)) {
        throw new AuthorizationError('Access denied. Insufficient permission.');
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireCoworkingAdmin() {
  return requireRole([UserRole.COWORKING_ADMIN]);
}

export function requireUser() {
  return requireRole([UserRole.USER]);
} 