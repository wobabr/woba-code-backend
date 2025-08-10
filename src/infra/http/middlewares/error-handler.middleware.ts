import { Request, Response, NextFunction } from 'express';
import { DomainError, ValidationError, BusinessError } from '@domain/errors/domain.error';
import { AuthenticationError, AuthorizationError } from '@infra/http/errors/http.error';
import { container } from 'tsyringe';
import { Logger } from '@services/logger.interface';

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const logger = container.resolve<Logger>('Logger');

  if (error instanceof ValidationError) {
    logger.warn('Validation error', {
      requestId: req.requestId,
      error: error.message,
      url: req.url,
      method: req.method
    });
    res.status(400).json({
      error: 'Validation Error',
      message: error.message
    });
    return;
  }

  if (error instanceof BusinessError) {
    logger.warn('Business error', {
      requestId: req.requestId,
      error: error.message,
      url: req.url,
      method: req.method
    });
    res.status(422).json({
      error: 'Business Error',
      message: error.message
    });
    return;
  }

  if (error instanceof AuthenticationError) {
    logger.warn('Authentication error', {
      requestId: req.requestId,
      error: error.message,
      url: req.url,
      method: req.method
    });
    res.status(401).json({
      error: 'Authentication Error',
      message: error.message
    });
    return;
  }

  if (error instanceof AuthorizationError) {
    logger.warn('Authorization error', {
      requestId: req.requestId,
      error: error.message,
      url: req.url,
      method: req.method
    });
    res.status(403).json({
      error: 'Authorization Error',
      message: error.message
    });
    return;
  }

  if (error instanceof DomainError) {
    logger.warn('Domain error', {
      requestId: req.requestId,
      error: error.message,
      url: req.url,
      method: req.method
    });
    res.status(400).json({
      error: 'Domain Error',
      message: error.message
    });
    return;
  }

  logger.error('Unexpected error', error, {
    requestId: req.requestId,
    url: req.url,
    method: req.method
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
} 