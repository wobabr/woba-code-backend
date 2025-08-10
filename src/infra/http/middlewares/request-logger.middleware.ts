import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { Logger } from '@services/logger.interface';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const logger = container.resolve<Logger>('Logger');
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  req.requestId = requestId;
  
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.userId,
    body: sanitizeBody(req.body),
    query: req.query,
    params: req.params
  });

  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: data ? JSON.stringify(data).length : 0,
      userId: req.userId
    });
    
    return originalSend.call(this, data);
  };

  next();
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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