import { PERMISSION } from '@common/constants/enums/permissions.enum';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '@common/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PERMISSION[]>(Permissions, context.getHandler());

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userData = request.user as JwtPayload;

    const userPermissions = userData.permissions as PERMISSION[];

    const isValid = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (!isValid) {
      throw new ForbiddenException('PERMISSION_DENIED');
    }

    return isValid;
  }
}
