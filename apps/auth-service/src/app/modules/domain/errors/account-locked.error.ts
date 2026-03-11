import { BaseError } from './base.error';

export class AccountLockedError extends BaseError {
  constructor() {
    super('ACCOUNT_LOCKED', 'ACCOUNT_LOCKED');
  }
}
