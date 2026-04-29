import { Inject, Injectable } from '@nestjs/common';
import { AuthPort } from './ports/auth.port';
import { AuthTokenResponse, RefreshTokenBodyDto } from './ports/dtos/auth.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AuthPort)
    private readonly authPort: AuthPort,
  ) {}

  execute(data: RefreshTokenBodyDto): Promise<AuthTokenResponse> {
    return this.authPort.refreshToken(data);
  }
}
