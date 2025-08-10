import { User, UserRole } from '../../../domain/entities/user.entity';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type PrismaUser = NonNullable<Awaited<ReturnType<typeof prisma.user.findFirst>>>;

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.role as UserRole,
      prismaUser.id,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }

  static toPrisma(user: User): any {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    };
  }

  static toPrismaUpdate(user: Partial<User>): any {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    };
  }
} 