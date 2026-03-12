import { BaseError } from './base.error';

export class EmailAlreadyVerifiedError extends BaseError {
  constructor() {
    super('EMAIL_ALREADY_VERIFIED', 'Email already verified');
  }
}
