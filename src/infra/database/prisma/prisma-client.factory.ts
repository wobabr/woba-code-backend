import { PrismaClient } from '@prisma/client';

export class PrismaClientFactory {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!PrismaClientFactory.instance) {
      PrismaClientFactory.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    }
    return PrismaClientFactory.instance;
  }

  static async disconnect(): Promise<void> {
    if (PrismaClientFactory.instance) {
      await PrismaClientFactory.instance.$disconnect();
    }
  }
} 