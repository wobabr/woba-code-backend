export interface AuthorizationService {
  canAccessResource(userId: number, resource: string, action: string): Promise<boolean>;
  canViewAllResources(userId: number, resource: string): Promise<boolean>;
  canViewOwnResources(userId: number, resource: string): Promise<boolean>;
  canModifyResource(userId: number, resource: string, resourceId: number): Promise<boolean>;
  getAccessibleResourceIds(userId: number, resource: string): Promise<number[]>;
} 