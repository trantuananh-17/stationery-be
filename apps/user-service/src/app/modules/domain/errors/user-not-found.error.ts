import { BaseError } from './base.error';

export class UserNotFound extends BaseError {
  constructor() {
    super('USER_NOT_FOUND', 'User not found');
  }
}
