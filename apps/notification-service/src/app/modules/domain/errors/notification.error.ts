import { BaseError } from './base.error';

export class NotificationNotFoundError extends BaseError {
  constructor() {
    super('PRODUCT_NOT_FOUND', 'Notification not found');
  }
}
