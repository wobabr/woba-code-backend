import { injectable, inject } from 'tsyringe';
import { UserRepository } from '@repositories/user-repository.interface';
import { AuthorizationService } from '@services/authorization-service.interface';
import { UserRole } from '@entities/user.entity';

@injectable()
export class AuthorizationServiceImpl implements AuthorizationService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async canAccessResource(userId: number, resource: string, action: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    const policies = this.getPolicies(user.role);
    return policies.canAccessResource(resource, action);
  }

  async canViewAllResources(userId: number, resource: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    const policies = this.getPolicies(user.role);
    return policies.canViewAllResources(resource);
  }

  async canViewOwnResources(userId: number, resource: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    const policies = this.getPolicies(user.role);
    return policies.canViewOwnResources(resource);
  }

  async canModifyResource(userId: number, resource: string, resourceId: number): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    const policies = this.getPolicies(user.role);
    return policies.canModifyResource(resource, resourceId);
  }

  async getAccessibleResourceIds(userId: number, resource: string): Promise<number[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) return [];

    if (user.role === UserRole.USER) {
      if (resource === 'booking') {
        const user = await this.userRepository.findById(userId);
        if (user) {
          return [user.id!];
        }
      }
    }

    return [];
  }

  private getPolicies(role: UserRole) {
    const policies = {
      [UserRole.USER]: {
        canAccessResource: (resource: string, action: string) => {
          const userPolicies = {
            booking: ['create', 'list', 'cancel', 'listByUser'],
            // Pode ser expandido conforme necessário
          };
          return userPolicies[resource]?.includes(action) || false;
        },
        canViewAllResources: (resource: string) => false,
        canViewOwnResources: (resource: string) => ['booking'].includes(resource),
        canModifyResource: (resource: string, resourceId: number) => ['booking'].includes(resource)
      },
      [UserRole.COWORKING_ADMIN]: {
        canAccessResource: (resource: string, action: string) => {
          const adminPolicies = {
            meetingRoom: ['create', 'list', 'delete', 'listBookings', 'listMine'],
            booking: ['adminCancel', 'list', 'create', 'cancel'],
          };
          return adminPolicies[resource]?.includes(action) || false;
        },
        canViewAllResources: (resource: string) => ['meetingRoom', 'booking'].includes(resource),
        canViewOwnResources: (resource: string) => ['meetingRoom', 'booking'].includes(resource),
        canModifyResource: (resource: string, resourceId: number) => ['meetingRoom', 'booking'].includes(resource)
      }
    };

    return policies[role];
  }
} 