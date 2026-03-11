import { Injectable } from '@nestjs/common';
import { ITokenService, TokenPayloadDto } from '../../application/ports/services/token.port';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: TokenPayloadDto): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  async generateRefreshToken(payload: TokenPayloadDto): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }
}
