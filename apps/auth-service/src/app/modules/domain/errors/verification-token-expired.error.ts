import { BaseError } from './base.error';

export class VerificationTokenExpiredError extends BaseError {
  constructor() {
    super('VERIFICATION_TOKEN_EXPIRED', 'Verification token expired');
  }
}
