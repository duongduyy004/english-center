import { IS_PUBLIC_KEY } from '@/decorator/customize.decorator';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';
import { PermissionEntity } from 'modules/permissions/entities/permission.entity';
import { PermissionCacheService } from './permission-cache.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionCacheService: PermissionCacheService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('Unauthenticated');
    // Admin bypass
    if (user.role?.id === RoleEnum.admin) {
      return true;
    }

    // Permission check
    const method = request.method.toUpperCase();
    const path = request.route.path

    // Get permissions from cache (or query DB if not cached)
    const permissions = await this.permissionCacheService.getPermissions(user.role.id);

    if (!permissions?.length) {
      throw new ForbiddenException('No permissions assigned');
    }

    const allowed = this.matchPermission(method, path, permissions);
    if (!allowed) {
      throw new ForbiddenException(`Permission denied: ${method} ${path}`);
    }

    return true;
  }

  private matchPermission(method: string, path: string, permissions: PermissionEntity[]): boolean {
    return permissions.some(p => {
      if (p.method.toUpperCase() !== method) return false;
      const originPath = p.path
      return path === originPath;
    });
  }
}
