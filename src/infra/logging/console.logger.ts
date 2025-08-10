import { injectable } from 'tsyringe';
import { Logger } from '@services/logger.interface';

@injectable()
export class ConsoleLogger implements Logger {
  info(message: string, context?: object): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, context ? JSON.stringify(context, null, 2) : '');
  }

  error(message: string, error?: Error, context?: object): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
    if (error?.stack) {
      console.error(`[${timestamp}] [ERROR] Stack:`, error.stack);
    }
    if (context) {
      console.error(`[${timestamp}] [ERROR] Context:`, JSON.stringify(context, null, 2));
    }
  }

  warn(message: string, context?: object): void {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, context ? JSON.stringify(context, null, 2) : '');
  }

  debug(message: string, context?: object): void {
    const timestamp = new Date().toISOString();
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${timestamp}] [DEBUG] ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }
} 