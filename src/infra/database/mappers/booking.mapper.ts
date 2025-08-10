import { Booking as DomainBooking } from '@entities/booking.entity';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type PrismaBooking = NonNullable<Awaited<ReturnType<typeof prisma.booking.findFirst>>>;

export class BookingMapper {
  static toDomain(prisma: PrismaBooking): DomainBooking {
    return new DomainBooking(
      prisma.meetingRoomId,
      prisma.userId,
      prisma.startDate,
      prisma.startDate,
      prisma.id,
      prisma.createdAt,
      prisma.updatedAt
    );
  }

  static toPrisma(domain: DomainBooking): any {
    return {
      meetingRoomId: domain.meetingRoomId,
      userId: domain.userId,
      startDate: domain.startDate,
      endDate: domain.endDate,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }
} 