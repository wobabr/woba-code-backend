import { ValidationError } from '@domain/errors/domain.error';

export class MeetingRoom {
  constructor(
    public name: string,
    public description: string,
    public capacity: number,
    public ownerId: number,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  validate(): void {
    if (!this.name || this.name.length < 2) {
      throw new ValidationError('The room name must have at least 2 characters.');
    }
    if (!this.capacity || this.capacity <= 0) {
      throw new ValidationError('Capacity must be greater than zero.');
    }
  }
} 