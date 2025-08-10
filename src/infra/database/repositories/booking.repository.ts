import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';
import { BookingRepository } from '@domain/repositories/booking-repository.interface';
import { Booking } from '@entities/booking.entity';
import { BookingMapper } from '../mappers/booking.mapper';

@injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private prisma: PrismaClient) {}

  async create(booking: Booking): Promise<Booking> {
    const data = BookingMapper.toPrisma(booking);
    const created = await this.prisma.booking.create({ data });
    return BookingMapper.toDomain(created);
  }

  async findById(id: number): Promise<Booking | null> {
    const found = await this.prisma.booking.findUnique({ where: { id } });
    return found ? BookingMapper.toDomain(found) : null;
  }

  async findAll(page = 1, limit = 10): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return bookings.map(BookingMapper.toDomain);
  }

  async findByRoomAndPeriod(meetingRoomId: number, startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        meetingRoomId,
        AND: [
          {
            startDate: { lt: endDate },
            endDate: { gt: startDate },
          },
        ],
      },
    });
    return bookings.map(BookingMapper.toDomain);
  }

  async findByMeetingRoomId(meetingRoomId: number): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({ where: { meetingRoomId } });
    return bookings.map(BookingMapper.toDomain);
  }

  async update(id: number, booking: Partial<Booking>): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id },
      data: booking,
    });
    return BookingMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }
} 