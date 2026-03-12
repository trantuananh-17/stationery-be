import { BaseError } from './base.error';

export class InvalidCurrentPasswordError extends BaseError {
  constructor() {
    super('INVALID_CURRENT_PASSWORD', 'Invalid current password');
  }
}
