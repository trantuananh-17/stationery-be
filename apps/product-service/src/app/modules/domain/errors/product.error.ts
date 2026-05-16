import { BaseError } from './base.error';

export class ProductNotFoundError extends BaseError {
  constructor() {
    super('PRODUCT_NOT_FOUND', 'Sản phẩm không tồn tại');
  }
}

export class ProductDeletedError extends BaseError {
  constructor() {
    super('PRODUCT_DELETED', 'Sản phẩm đã bị xoá');
  }
}

export class InvalidPriceError extends BaseError {
  constructor(price?: number) {
    super(
      'INVALID_PRICE',
      price !== undefined ? `Giá sản phẩm không hợp lệ: ${price}` : 'Giá sản phẩm không hợp lệ',
    );
  }
}

export class InvalidStockError extends BaseError {
  constructor(stock?: number) {
    super(
      'INVALID_STOCK',
      stock !== undefined ? `Tồn kho không hợp lệ: ${stock}` : 'Tồn kho không hợp lệ',
    );
  }
}

export class SkuRequiredError extends BaseError {
  constructor() {
    super('SKU_REQUIRED', 'SKU là bắt buộc');
  }
}

export class CancelStockFailedError extends BaseError {
  constructor(variantId: string) {
    super('CANCEL_STOCK_FAILED', `Huỷ giữ kho thất bại cho biến thể ${variantId}`);
  }
}

export class ConfirmStockFailedError extends BaseError {
  constructor(variantId: string) {
    super('CONFIRM_STOCK_FAILED', `Xác nhận tồn kho thất bại cho biến thể ${variantId}`);
  }
}
