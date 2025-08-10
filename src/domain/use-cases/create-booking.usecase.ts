import { injectable, inject } from 'tsyringe';
import { BookingRepository } from '@repositories/booking-repository.interface';
import { MeetingRoomRepository } from '@repositories/meeting-room-repository.interface';
import { Booking } from '@entities/booking.entity';
import { BusinessError } from '@domain/errors/domain.error';

export type CreateBookingDTO = {
  meetingRoomId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
};

@injectable()
export class CreateBookingUseCase {
  constructor(
    @inject('BookingRepository')
    private bookingRepository: BookingRepository,
    @inject('MeetingRoomRepository')
    private meetingRoomRepository: MeetingRoomRepository
  ) {}

  async execute(data: CreateBookingDTO): Promise<Booking> {
    // Verifica se a sala existe
    const room = await this.meetingRoomRepository.findById(data.meetingRoomId);
    if (!room) {
      throw new BusinessError('Meeting room not found.');
    }
    // Validação de horários e conflitos
    const booking = new Booking(data.meetingRoomId, data.userId, data.startDate, data.endDate);
    const conflicts = await this.bookingRepository.findByRoomAndPeriod(
      data.meetingRoomId,
      data.startDate,
      data.endDate
    );
    if (conflicts.length > 0) {
      throw new BusinessError('There is already a booking for this time slot in this room.');
    }
    return this.bookingRepository.create(booking);
  }
} 