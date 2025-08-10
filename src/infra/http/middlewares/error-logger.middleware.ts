import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { Logger } from '@services/logger.interface';

export function errorLoggerMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void {
  const logger = container.resolve<Logger>('Logger');
  
  logger.error('Request error', error, {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.userId,
    userAgent: req.get('User-Agent'),
    body: sanitizeBody(req.body),
    query: req.query,
    params: req.params,
    stack: error.stack
  });

  next(error);
}

function sanitizeBody(body: any): any {
  if (!body) return body;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
} 