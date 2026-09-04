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

export class VariantNotFoundError extends BaseError {
  constructor(variantId: string) {
    super('VARIANT_NOT_FOUND', `Biến thể không tồn tại: ${variantId}`);
  }
}

export class StockBelowReservedError extends BaseError {
  constructor(variantId: string, stock: number, reservedStock: number) {
    super(
      'STOCK_BELOW_RESERVED',
      `Không thể đặt tồn kho ${stock} cho biến thể ${variantId} vì đang giữ ${reservedStock} cho đơn chưa hoàn tất`,
    );
  }
}

export class InvalidRatingError extends BaseError {
  constructor(rating: number) {
    super('INVALID_RATING', `Điểm đánh giá phải từ 1 đến 5, nhận được: ${rating}`);
  }
}

export class ReviewNotFoundError extends BaseError {
  constructor() {
    super('REVIEW_NOT_FOUND', 'Đánh giá không tồn tại');
  }
}
