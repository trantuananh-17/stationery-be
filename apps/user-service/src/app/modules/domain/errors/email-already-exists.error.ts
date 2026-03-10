import { BaseError } from './base.error';

export class EmailAlreadyExistsError extends BaseError {
  constructor() {
    super('EMAIL_EXISTS', 'Email already exists');
  }
}
