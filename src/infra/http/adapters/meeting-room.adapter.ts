import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { BaseAdapter } from './base.adapter';
import { MeetingRoomRepository } from '@domain/repositories/meeting-room-repository.interface';
import { CreateMeetingRoomUseCase, CreateMeetingRoomDTO } from '@usecases/create-meeting-room.usecase';
import { BookingRepository } from '@domain/repositories/booking-repository.interface';

@injectable()
export class MeetingRoomAdapter extends BaseAdapter {
  constructor(
    @inject('MeetingRoomRepository') private meetingRoomRepository: MeetingRoomRepository,
    @inject(CreateMeetingRoomUseCase) private createMeetingRoomUseCase: CreateMeetingRoomUseCase,
    @inject('AuthorizationService') authorizationService: any,
    @inject('BookingRepository') private bookingRepository: BookingRepository
  ) {
    super(authorizationService);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'meetingRoom', 'create');
      const { name, description, capacity } = req.body;
      const ownerId = req.userId;
      const meetingRoom = await this.createMeetingRoomUseCase.execute({ name, description, capacity, ownerId } as CreateMeetingRoomDTO);
      res.status(201).json(meetingRoom);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'meetingRoom', 'list');
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const rooms = await this.meetingRoomRepository.findAll(page, limit);
      res.json({ data: rooms, total: rooms.length });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'meetingRoom', 'delete');
      const roomId = Number(req.params.id);
      const userId = req.userId;
      const room = await this.meetingRoomRepository.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
      if (room.ownerId !== userId) {
        return res.status(403).json({ error: 'Você só pode excluir suas próprias salas' });
      }
      await this.meetingRoomRepository.delete(roomId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'meetingRoom', 'list');
      const userId = req.userId;
      const rooms = await this.meetingRoomRepository.findByOwnerId(userId);
      res.json({ data: rooms, total: rooms.length });
    } catch (error) {
      next(error);
    }
  }

  async listBookings(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateAccess(req, 'meetingRoom', 'listBookings');
      const roomId = Number(req.params.id);
      const userId = req.userId;
      const room = await this.meetingRoomRepository.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
      if (room.ownerId !== userId) {
        return res.status(403).json({ error: 'Você só pode ver reservas das suas próprias salas' });
      }
      const bookings = await this.bookingRepository.findByMeetingRoomId(roomId);
      res.json({ data: bookings, total: bookings.length });
    } catch (error) {
      next(error);
    }
  }

  async publicList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const rooms = await this.meetingRoomRepository.findAll(page, limit);
      const dateParam = req.query.date as string | undefined;
      let targetDate: Date;
      if (dateParam) {
        // Interpreta a data como UTC (YYYY-MM-DD)
        const [year, month, day] = dateParam.split('-').map(Number);
        targetDate = new Date(Date.UTC(year, month - 1, day));
      } else {
        const now = new Date();
        targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      }
      const startHour = 8;
      const endHour = 18;

      const data = await Promise.all(rooms.map(async (room) => {
        // Buscar reservas do dia para a sala (em UTC)
        const startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(startHour, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(endHour, 0, 0, 0);
        const bookings = await this.bookingRepository.findByRoomAndPeriod(
          room.id!,
          startOfDay,
          endOfDay
        );
        // Montar array de horários ocupados (em UTC)
        const reservedHours = bookings.map(b => ({
          start: new Date(b.startDate).getUTCHours(),
          end: new Date(b.endDate).getUTCHours()
        }));
        // Gerar todos os horários possíveis
        const availableHours: string[] = [];
        for (let h = startHour; h < endHour; h++) {
          // Verifica se o horário está reservado
          const isReserved = reservedHours.some(r => h >= r.start && h < r.end);
          if (!isReserved) {
            // Formato HH:00-HH+1:00
            availableHours.push(`${h.toString().padStart(2, '0')}:00-${(h+1).toString().padStart(2, '0')}:00`);
          }
        }
        return {
          ...room,
          availableHours,
          date: targetDate.toISOString().slice(0, 10)
        };
      }));
      res.json({ data, total: data.length });
    } catch (error) {
      next(error);
    }
  }
} 