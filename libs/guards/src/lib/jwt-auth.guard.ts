import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithMetadata } from '@common/interfaces/common/request-with-metadata.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithMetadata>();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('TOKEN_MISSING');
    }

    try {
      const payload = await this.jwtService.verify(token);

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
  }

  private extractToken(request: RequestWithMetadata): string | null {
    const authHeader = request.headers?.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : null;
  }
}
