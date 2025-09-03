import { IS_PUBLIC_KEY, ROLES_KEY } from '@/decorator/customize.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    const request = context.switchToHttp().getRequest();
    if (request?.user && request?.user?.role?.id === RoleEnum.admin) return true;

    if (!roles?.length) {
      return false;
    }
    const userId = this.getParamsId(request.params)
    return roles.map(String).includes(String(request.user?.role?.id)) && request.user.id === userId;
  }

  private getParamsId(params: any) {
    return params?.id || params?.studentId || params?.parentId || params?.teacherId
  }
}
