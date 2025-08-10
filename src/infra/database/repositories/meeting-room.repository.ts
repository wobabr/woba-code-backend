import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';
import { MeetingRoomRepository } from '@domain/repositories/meeting-room-repository.interface';
import { MeetingRoom } from '@entities/meeting-room.entity';
import { MeetingRoomMapper } from '../mappers/meeting-room.mapper';

@injectable()
export class PrismaMeetingRoomRepository implements MeetingRoomRepository {
  constructor(private prisma: PrismaClient) {}

  async create(meetingRoom: MeetingRoom): Promise<MeetingRoom> {
    const data = MeetingRoomMapper.toPrisma(meetingRoom);
    const created = await this.prisma.meetingRoom.create({ data });
    return MeetingRoomMapper.toDomain(created);
  }

  async findById(id: number): Promise<MeetingRoom | null> {
    const found = await this.prisma.meetingRoom.findUnique({ where: { id } });
    return found ? MeetingRoomMapper.toDomain(found) : null;
  }

  async findAll(page = 1, limit = 10): Promise<MeetingRoom[]> {
    const rooms = await this.prisma.meetingRoom.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return rooms.map(MeetingRoomMapper.toDomain);
  }

  async findByOwnerId(ownerId: number): Promise<MeetingRoom[]> {
    const rooms = await this.prisma.meetingRoom.findMany({ where: { ownerId } });
    return rooms.map(MeetingRoomMapper.toDomain);
  }

  async update(id: number, meetingRoom: Partial<MeetingRoom>): Promise<MeetingRoom> {
    const updated = await this.prisma.meetingRoom.update({
      where: { id },
      data: meetingRoom,
    });
    return MeetingRoomMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.meetingRoom.delete({ where: { id } });
  }
} 