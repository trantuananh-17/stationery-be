import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userId = request.user.userId;
    const resourceUserId = request.params.id;

    if (userId !== resourceUserId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    return true;
  }
}
