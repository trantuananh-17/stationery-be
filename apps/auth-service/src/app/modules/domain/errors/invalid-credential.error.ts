import { BaseError } from './base.error';

export class InvalidCredentialError extends BaseError {
  constructor() {
    super('INVALID_CREDENTIALS', 'INVALID_CREDENTIALS');
  }
}
