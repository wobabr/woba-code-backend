import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { BaseAdapter } from './base.adapter';
import { BookingRepository } from '@domain/repositories/booking-repository.interface';
import { CreateBookingUseCase, CreateBookingDTO } from '@usecases/create-booking.usecase';
import { SendBookingConfirmationUseCase } from '@usecases/send-booking-confirmation.usecase';
import { MeetingRoomRepository } from '@domain/repositories/meeting-room-repository.interface';

@injectable()
export class BookingAdapter extends BaseAdapter {
  constructor(
    @inject('BookingRepository') private bookingRepository: BookingRepository,
    @inject(CreateBookingUseCase) private createBookingUseCase: CreateBookingUseCase,
    @inject(SendBookingConfirmationUseCase) private sendBookingConfirmationUseCase: SendBookingConfirmationUseCase,
    @inject('AuthorizationService') authorizationService: any,
    @inject('MeetingRoomRepository') private meetingRoomRepository: MeetingRoomRepository
  ) {
    super(authorizationService);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'booking', 'create');
      const { meetingRoomId, startDate, endDate, userEmail } = req.body;
      const userId = req.userId; // Sempre usar o userId autenticado
      const booking = await this.createBookingUseCase.execute({
        meetingRoomId: Number(meetingRoomId),
        userId: Number(userId),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      } as CreateBookingDTO);
      await this.sendBookingConfirmationUseCase.execute(booking, userEmail);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'booking', 'list');
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const bookings = await this.bookingRepository.findAll(page, limit);
      res.json({ data: bookings, total: bookings.length });
    } catch (error) {
      next(error);
    }
  }

  async listByUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'booking', 'list');
      const userId = req.userId;
      const bookings = await this.bookingRepository.findAll();
      const userBookings = bookings.filter(b => b.userId === userId);
      res.json({ data: userBookings, total: userBookings.length });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'booking', 'cancel');
      const bookingId = Number(req.params.id);
      const userId = req.userId;
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ error: 'Você só pode cancelar suas próprias reservas' });
      }
      await this.bookingRepository.delete(bookingId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async adminCancel(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'booking', 'adminCancel');
      const bookingId = Number(req.params.id);
      const userId = req.userId;
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      // Buscar a sala da reserva
      const meetingRoom = await this.meetingRoomRepository.findById(booking.meetingRoomId);
      if (!meetingRoom) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
      if (meetingRoom.ownerId !== userId) {
        return res.status(403).json({ error: 'Você só pode cancelar reservas das suas próprias salas' });
      }
      await this.bookingRepository.delete(bookingId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
} 