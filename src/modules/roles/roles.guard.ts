import { IS_PUBLIC_KEY } from '@/decorator/customize.decorator';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';
import { PermissionEntity } from 'modules/permissions/entities/permission.entity';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
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

    let role: RoleEntity & { permissions?: PermissionEntity[] } = user.role;
    if (!role?.permissions) {
      role = await this.dataSource.getRepository(RoleEntity).findOne({
        where: { id: user.role.id },
        relations: ['permissions'],
      }) as any;
    }

    if (!role?.permissions?.length) {
      throw new ForbiddenException('No permissions assigned');
    }

    const allowed = this.matchPermission(method, path, role.permissions);
    if (!allowed) {
      throw new ForbiddenException(`Permission denied: ${method} ${path}`);
    }

    return true;
  }

  private matchPermission(method: string, path: string, permissions: PermissionEntity[]): boolean {
    return permissions.some(p => {
      if (p.method.toUpperCase() !== method) return false;
      const originPath = `/api/v${p.version.toString()}${p.path}`
      return path === originPath;
    });
  }
}
