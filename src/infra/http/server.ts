import 'reflect-metadata';
import dotenv from 'dotenv';
import app from '../../app';
import { container } from 'tsyringe';
import { Logger } from '@services/logger.interface';
import { AdminAccessTokenService } from '@shared/services/admin-access-token.service';

dotenv.config();

const PORT = process.env.PORT || 3000;

const logger = container.resolve<Logger>('Logger');

(async () => {
  const adminTokenService = new AdminAccessTokenService();
  await adminTokenService.init();

  app.listen(PORT, () => {
    logger.info(`API running on port ${PORT}`);
  });
})();