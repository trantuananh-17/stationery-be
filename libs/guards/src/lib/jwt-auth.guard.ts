import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('TOKEN_MISSING');
    }

    try {
      const payload = await this.jwtService.verify(token);

      request.user = payload;

      return true;
    } catch (error) {
      console.log('JWT ERROR:', error);
      throw new UnauthorizedException('INVALID_TOKEN');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : null;
  }
}
