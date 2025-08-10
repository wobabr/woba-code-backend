import { Booking } from '@entities/booking.entity';

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: number): Promise<Booking | null>;
  findAll(page?: number, limit?: number): Promise<Booking[]>;
  findByRoomAndPeriod(meetingRoomId: number, startDate: Date, endDate: Date): Promise<Booking[]>;
  findByMeetingRoomId(meetingRoomId: number): Promise<Booking[]>;
  update(id: number, booking: Partial<Booking>): Promise<Booking>;
  delete(id: number): Promise<void>;
} 