import { LoginRequestDTO } from '@infra/http/dtos/auth/login.request.dto';
import { ValidationError } from '@domain/errors/domain.error';

export class AuthValidator {
  static validateLogin(data: any): LoginRequestDTO {
    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
      throw new ValidationError('Email is required and must be a non-empty string');
    }

    if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
      throw new ValidationError('Password is required');
    }

    return {
      email: data.email.trim().toLowerCase(),
      password: data.password
    };
  }
} 