import { BaseError } from './base.error';

export class AddressNotFoundError extends BaseError {
  constructor() {
    super('ADDRESS_NOT_FOUND', 'Address not found');
  }
}
