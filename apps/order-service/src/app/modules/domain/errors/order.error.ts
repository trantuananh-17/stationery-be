import { BaseError } from './base.error';

export class OrderNotFound extends BaseError {
  constructor() {
    super('ORDER_NOT_FOUND', 'Order payment not found');
  }
}
export class OrderNotPayable extends BaseError {
  constructor() {
    super('ORDER_NOT_PAYABLE', 'Order is not payable');
  }
}
export class OrderPair extends BaseError {
  constructor() {
    super('ODER_PAIR', 'Order already paid');
  }
}
export class OrderPaymentExpired extends BaseError {
  constructor() {
    super('ORDER_PAYMENT_EXPIRED', 'Order payment expired');
  }
}
export class InvalidOrderTotal extends BaseError {
  constructor() {
    super('INVALID_ORDER_TOTAL', 'Invalid order total');
  }
}
export class OrderNotItems extends BaseError {
  constructor() {
    super('ORDER_NO_ITEMS', 'Order has no items');
  }
}
