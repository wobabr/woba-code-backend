import { ValidationError } from '@domain/errors/domain.error';

export class Booking {
  constructor(
    public meetingRoomId: number,
    public userId: number,
    public startDate: Date,
    public endDate: Date,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  validate(): void {
    if (!this.meetingRoomId || this.meetingRoomId <= 0) {
      throw new ValidationError('Meeting room ID is required.');
    }
    if (!this.userId || this.userId <= 0) {
      throw new ValidationError('User ID is required.');
    }
    if (!this.startDate || this.endDate) {
      throw new ValidationError('Start and end date/time are required.');
    }
    if (this.startDate > this.endDate) {
      throw new ValidationError('Start date/time must be before end date/time.');
    }

    if (
      this.startDate.getMinutes() !== 0 ||
      this.endDate.getMinutes() !== 0 ||
      (this.endDate.getTime() - this.startDate.getTime()) % (60 * 60 * 1000) !== 0
    ) {
      throw new ValidationError('Bookings must be made only on the hour.');
    }
  }
} 