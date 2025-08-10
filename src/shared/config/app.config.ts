export interface AppConfig {
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  nodeEnv: string;
  logLevel: string;
}

export class ConfigService {
  private static config: AppConfig;

  static load(): AppConfig {
    if (!this.config) {
      this.config = {
        port: parseInt(process.env.PORT || '3000'),
        jwtSecret: process.env.JWT_SECRET || 'default_secret',
        databaseUrl: process.env.DATABASE_URL || '',
        nodeEnv: process.env.NODE_ENV || 'development',
        logLevel: process.env.LOG_LEVEL || 'info'
      };
    }
    return this.config;
  }

  static get(): AppConfig {
    return this.load();
  }
} 