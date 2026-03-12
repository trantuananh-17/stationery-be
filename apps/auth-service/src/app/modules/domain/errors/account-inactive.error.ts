import { BaseError } from './base.error';

export class AccountInactiveError extends BaseError {
  constructor() {
    super('ACCOUNT_INACTIVE', 'Account is inactive');
  }
}
