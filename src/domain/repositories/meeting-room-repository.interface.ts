import { MeetingRoom } from '@entities/meeting-room.entity';

export interface MeetingRoomRepository {
  create(meetingRoom: MeetingRoom): Promise<MeetingRoom>;
  findById(id: number): Promise<MeetingRoom | null>;
  findAll(page?: number, limit?: number): Promise<MeetingRoom[]>;
  update(id: number, meetingRoom: Partial<MeetingRoom>): Promise<MeetingRoom>;
  delete(id: number): Promise<void>;
  findByOwnerId(ownerId: number): Promise<MeetingRoom[]>;
} 