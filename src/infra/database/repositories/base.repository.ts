import { PrismaClient } from '@prisma/client';
import { PrismaClientFactory } from '@infra/database/prisma/prisma-client.factory';

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaClientFactory.getInstance();
  }

  protected async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  protected async disconnect(): Promise<void> {
    await PrismaClientFactory.disconnect();
  }
} 