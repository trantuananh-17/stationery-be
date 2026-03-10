import { BaseError } from './base.error';

export class InvalidEmail extends BaseError {
  constructor() {
    super('INVALID_EMAIL_FORMAT', 'Invalid email format');
  }
}
