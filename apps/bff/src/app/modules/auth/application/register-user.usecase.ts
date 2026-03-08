import { Inject, Injectable } from '@nestjs/common';
import { AuthPort } from './ports/auth.port';
import { RegisterUserBodyDto, UserResponse } from './ports/dtos/auth.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(AuthPort)
    private readonly authPort: AuthPort,
  ) {}

  execute(data: RegisterUserBodyDto): Promise<UserResponse> {
    return this.authPort.registerUser(data);
  }
}
