import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from '@repositories/user-repository.interface';
import { HashService } from '@services/hash-service.interface';
import { TokenService } from '@services/token-service.interface';
import { AuthValidator } from '@infra/http/validators/auth.validator';
import { LoginResponseDTO } from '@infra/http/dtos/auth/login.request.dto';
import { AuthenticationError } from '@infra/http/errors/http.error';
import { BaseAdapter } from './base.adapter';

@injectable()
export class AuthAdapter extends BaseAdapter {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('HashService')
    private hashService: HashService,
    @inject('TokenService')
    private tokenService: TokenService,
    @inject('AuthorizationService')
    authorizationService: any
  ) {
    super(authorizationService);
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData = AuthValidator.validateLogin(req.body);

      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user || !(await this.hashService.compare(loginData.password, user.password))) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = this.tokenService.sign({ sub: user.id });
      
      const response: LoginResponseDTO = {
        token,
        user: {
          id: user.id!,
          name: user.name,
          email: user.email
        }
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
} 