import { Request, Response, NextFunction } from 'express';
import { inject } from 'tsyringe';
import { AuthorizationService } from '@services/authorization-service.interface';
import { AuthorizationError } from '@infra/http/errors/http.error';
import { Logger } from '@services/logger.interface';
import { container } from 'tsyringe';

export abstract class BaseAdapter {
  protected logger: Logger;

  constructor(
    @inject('AuthorizationService')
    protected authorizationService: AuthorizationService
  ) {
    this.logger = container.resolve<Logger>('Logger');
  }

  protected async validateAccess(req: Request, resource: string, action: string): Promise<void> {
    const userId = req.userId;
    if (!userId) {
      this.logger.warn('Access validation failed - User not authenticated', {
        requestId: req.requestId,
        resource,
        action,
        url: req.url,
        method: req.method
      });
      throw new AuthorizationError('User not authenticated');
    }

    const canAccess = await this.authorizationService.canAccessResource(userId, resource, action);
    if (!canAccess) {
      this.logger.warn('Access validation failed - Insufficient permissions', {
        requestId: req.requestId,
        userId,
        resource,
        action,
        url: req.url,
        method: req.method
      });
      throw new AuthorizationError('Access denied');
    }

    this.logger.debug('Access validation successful', {
      requestId: req.requestId,
      userId,
      resource,
      action
    });
  }

  protected async getFilteredData<T>(
    req: Request,
    resource: string,
    fetchAllData: () => Promise<T[]>,
    fetchOwnData: (userId: number) => Promise<T[]>
  ): Promise<{ data: T[], total: number }> {
    const userId = req.userId!;
    
    const canViewAll = await this.authorizationService.canViewAllResources(userId, resource);
    const canViewOwn = await this.authorizationService.canViewOwnResources(userId, resource);

    this.logger.debug('Data filtering decision', {
      requestId: req.requestId,
      userId,
      resource,
      canViewAll,
      canViewOwn
    });

    if (canViewAll) {
      const data = await fetchAllData();
      return { data, total: data.length };
    } else if (canViewOwn) {
      const data = await fetchOwnData(userId);
      return { data, total: data.length };
    } else {
      this.logger.warn('Data access denied', {
        requestId: req.requestId,
        userId,
        resource
      });
      throw new AuthorizationError('Access denied');
    }
  }

  protected async getAccessibleIds(req: Request, resource: string): Promise<number[]> {
    const userId = req.userId!;
    const ids = await this.authorizationService.getAccessibleResourceIds(userId, resource);
    
    this.logger.debug('Retrieved accessible resource IDs', {
      requestId: req.requestId,
      userId,
      resource,
      accessibleIds: ids
    });
    
    return ids;
  }
} 