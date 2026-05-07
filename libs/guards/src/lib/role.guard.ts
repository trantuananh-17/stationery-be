import { ROLE } from '@common/constants/enums/role.enum';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@common/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<ROLE[]>(Roles, context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userData = request.user as JwtPayload;

    const userRole = userData.role as ROLE;

    const isValid = requiredRoles.includes(userRole);

    if (!isValid) {
      throw new ForbiddenException('ROLE_DENIED');
    }

    return isValid;
  }
}
