import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';

export const UserData = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userData = request.user as JwtPayload;

    if (!userData) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    return data ? userData[data] : userData;
  },
);
