import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';

export const OptionalUserData = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userData = request.user as JwtPayload | undefined;

    if (!userData) {
      return undefined;
    }

    return data ? userData[data] : userData;
  },
);
