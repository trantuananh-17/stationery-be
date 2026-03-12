import { BaseError } from './base.error';

export class VerificationTokenNotFoundError extends BaseError {
  constructor() {
    super('VERIFICATION_TOKEN_NOT_FOUND', 'Verification token not found');
  }
}
