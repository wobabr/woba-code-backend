import { CreateUserRequestDTO } from '@infra/http/dtos/user/create-user.request.dto';
import { ValidationError } from '@domain/errors/domain.error';

export class UserValidator {
  static validateCreateUser(data: any): CreateUserRequestDTO {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new ValidationError('Name is required and must be a non-empty string');
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
      throw new ValidationError('Email is required and must be a non-empty string');
    }

    if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
      throw new ValidationError('Password is required and must be at least 6 characters');
    }

    return {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password
    };
  }
} 