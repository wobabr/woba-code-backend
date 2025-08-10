import { UserRepository } from '@repositories/user-repository.interface';
import { User } from '@entities/user.entity';
import { UserMapper } from '@infra/database/mappers/user.mapper';
import { BaseRepository } from '@infra/database/repositories/base.repository';
import { injectable } from 'tsyringe';

@injectable()
export class UserRepositoryImpl extends BaseRepository implements UserRepository {

  async create(user: User): Promise<User> {
    const userData = UserMapper.toPrisma(user);
    const prismaUser = await this.prisma.user.create({ data: userData });
    return UserMapper.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { email } });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findById(id: number): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { id } });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }
} 