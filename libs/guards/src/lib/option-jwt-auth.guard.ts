import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) {
      request.user = null;
      return true;
    }

    try {
      const payload = await this.jwtService.verify(token);

      request.user = payload;

      return true;
    } catch {
      request.user = null;
      return true;
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : null;
  }
}
