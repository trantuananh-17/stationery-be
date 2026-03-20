import { BaseError } from './base.error';

export class ProductNotFoundError extends BaseError {
  constructor() {
    super('PRODUCT_NOT_FOUND', 'PRODUCT_NOT_FOUND');
  }
}
