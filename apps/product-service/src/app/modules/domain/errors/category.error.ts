import { BaseError } from './base.error';

export class CategoryNotFoundError extends BaseError {
  constructor() {
    super('CATEGORY_NOT_FOUND', 'CATEGORY_NOT_FOUND');
  }
}
