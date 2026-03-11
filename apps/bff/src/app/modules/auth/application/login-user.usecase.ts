import { Inject, Injectable } from '@nestjs/common';
import { AuthPort } from './ports/auth.port';
import { LoginUserBodyDto, LoginUserResponse } from './ports/dtos/auth.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AuthPort)
    private readonly authPort: AuthPort,
  ) {}

  execute(data: LoginUserBodyDto): Promise<LoginUserResponse> {
    return this.authPort.loginUser(data);
  }
}
