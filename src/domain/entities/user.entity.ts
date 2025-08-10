export enum UserRole {
  USER = 'USER',
  COWORKING_ADMIN = 'COWORKING_ADMIN'
}

export class User {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole = UserRole.USER,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
} 