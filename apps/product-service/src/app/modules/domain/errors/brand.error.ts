import { BaseError } from './base.error';

export class BrandNotFoundError extends BaseError {
  constructor() {
    super('BRAND_NOT_FOUND', 'BRAND_NOT_FOUND');
  }
}
