import { injectable, inject } from 'tsyringe';
import { MeetingRoomRepository } from '@repositories/meeting-room-repository.interface';
import { MeetingRoom } from '@entities/meeting-room.entity';

export type CreateMeetingRoomDTO = {
  name: string;
  description: string;
  capacity: number;
  ownerId: number;
};

@injectable()
export class CreateMeetingRoomUseCase {
  constructor(
    @inject('MeetingRoomRepository')
    private meetingRoomRepository: MeetingRoomRepository
  ) {}

  async execute(data: CreateMeetingRoomDTO): Promise<MeetingRoom> {
    const meetingRoom = new MeetingRoom(data.name, data.description, data.capacity, data.ownerId);
    meetingRoom.validate();
    return this.meetingRoomRepository.create(meetingRoom);
  }
} 