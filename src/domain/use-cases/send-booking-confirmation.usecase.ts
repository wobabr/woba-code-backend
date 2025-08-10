import { injectable } from 'tsyringe';
import { Booking } from '@entities/booking.entity';

@injectable()
export class SendBookingConfirmationUseCase {
  async execute(booking: Booking, userEmail: string): Promise<void> {
    // Simula envio de e-mail logando no console
    console.log(`Confirmação de reserva enviada para ${userEmail}:\nSala: ${booking.meetingRoomId}\nInício: ${booking.startDate}\nFim: ${booking.endDate}`);
  }
} 