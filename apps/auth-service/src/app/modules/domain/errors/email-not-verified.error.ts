import { BaseError } from './base.error';

export class EmailNotVerifiedError extends BaseError {
  constructor() {
    super('EMAIL_NOT_VERIFIED', 'EMAIL_NOT_VERIFIED');
  }
}
