import { Injectable } from '@nestjs/common';

import { AuthPort } from './ports/auth.port';
import { ForgotPasswordBodyDto, ResetPasswordBodyDto } from './ports/dtos/auth.dto';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authPort: AuthPort) {}

  execute(data: ForgotPasswordBodyDto): Promise<void> {
    return this.authPort.forgotPassword(data);
  }
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authPort: AuthPort) {}

  execute(data: ResetPasswordBodyDto): Promise<void> {
    return this.authPort.resetPassword(data);
  }
}
