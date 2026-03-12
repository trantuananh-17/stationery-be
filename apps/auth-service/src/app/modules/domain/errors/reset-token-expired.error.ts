import { BaseError } from './base.error';

export class ResetTokenExpiredError extends BaseError {
  constructor() {
    super('RESET_TOKEN_EXPIRED', 'Reset token expired');
  }
}
