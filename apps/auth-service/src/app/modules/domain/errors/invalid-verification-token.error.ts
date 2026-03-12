import { BaseError } from './base.error';

export class InvalidVerificationTokenError extends BaseError {
  constructor() {
    super('INVALID_VERIFICATION_TOKEN', 'Invalid verification token');
  }
}
