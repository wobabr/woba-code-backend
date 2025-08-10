import { MeetingRoom as DomainMeetingRoom } from '../../../domain/entities/meeting-room.entity';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type PrismaMeetingRoom = NonNullable<Awaited<ReturnType<typeof prisma.meetingRoom.findFirst>>>;

export class MeetingRoomMapper {
  static toDomain(prisma: PrismaMeetingRoom): DomainMeetingRoom {
    return new DomainMeetingRoom(
      prisma.name,
      prisma.description,
      prisma.capacity,
      prisma.ownerId,
      prisma.id,
      prisma.createdAt,
      prisma.updatedAt
    );
  }

  static toPrisma(domain: DomainMeetingRoom): any {
    return {
      name: domain.name,
      description: domain.description,
      capacity: domain.capacity,
      ownerId: domain.ownerId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }
} 