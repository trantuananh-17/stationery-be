import { BaseError } from './base.error';

export class ResetTokenNotFoundError extends BaseError {
  constructor() {
    super('RESET_TOKEN_NOT_FOUND', 'Reset token not found');
  }
}
