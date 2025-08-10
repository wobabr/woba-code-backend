import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { CreateUserUseCase } from '@usecases/create-user.usecase';
import { HashService } from '@services/hash-service.interface';
import { UserValidator } from '@infra/http/validators/user.validator';
import { CreateUserResponseDTO } from '@infra/http/dtos/user/create-user.request.dto';
import { BaseAdapter } from './base.adapter';
import { AdminAccessTokenService } from '@shared/services/admin-access-token.service';
import { UserRole } from '@entities/user.entity';

@injectable()
export class UserAdapter extends BaseAdapter {
  constructor(
    @inject(CreateUserUseCase)
    private createUserUseCase: CreateUserUseCase,
    @inject('HashService')
    private hashService: HashService,
    @inject('AuthorizationService')
    authorizationService: any
  ) {
    super(authorizationService);
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // O validador já ignora qualquer campo extra, inclusive role
      const userData = UserValidator.validateCreateUser(req.body);
      const accessToken = req.header('accessToken');
      let role = UserRole.USER;

      if (accessToken) {
        const adminTokenService = new AdminAccessTokenService();
        const isValid = await adminTokenService.validateAndConsume(accessToken);
        if (isValid) {
          role = UserRole.COWORKING_ADMIN;
        } else {
          res.status(403).json({ message: 'AccessToken inválido ou já utilizado.' });
          return;
        }
      }
      const hashed = await this.hashService.hash(userData.password);
      // Garante que role só é definido internamente
      const user = await this.createUserUseCase.execute({ 
        name: userData.name, 
        email: userData.email, 
        password: hashed,
        role // nunca vem da request
      });
      const response: CreateUserResponseDTO = {
        id: user.id!,
        name: user.name,
        email: user.email
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
} 