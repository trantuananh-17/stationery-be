import { BaseError } from './base.error';

export class InvalidResetTokenError extends BaseError {
  constructor() {
    super('INVALID_RESET_TOKEN', 'Invalid reset token');
  }
}
