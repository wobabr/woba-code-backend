import { injectable, inject } from 'tsyringe';
import { UserRepository } from '@repositories/user-repository.interface';
import { User } from '@entities/user.entity';
import { BusinessError } from '@domain/errors/domain.error';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepo: UserRepository
  ) {}

  async execute(userData: Omit<Partial<User>, 'id'>): Promise<User> {
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) throw new BusinessError('User already exists');
    return this.userRepo.create(new User(
      userData.name!,
      userData.email!,
      userData.password!,
      userData.role ?? undefined // Passa o role se existir, senão undefined
    ));
  }
} 
