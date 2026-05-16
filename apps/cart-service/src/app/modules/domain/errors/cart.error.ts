import { BaseError } from './base.error';

export class CartUserOrSessionRequiredError extends BaseError {
  constructor() {
    super('CART_USER_OR_SESSION_REQUIRED', 'UserId hoặc SessionId là bắt buộc');
  }
}

export class UserRequired extends BaseError {
  constructor() {
    super('USER_REQUIRED', 'Bạn cần phải đăng nhập để thực hiện');
  }
}

export class CartCurrencyRequiredError extends BaseError {
  constructor() {
    super('CART_CURRENCY_REQUIRED', 'Tiền tệ là bắt buộc');
  }
}

export class CartIdRequiredError extends BaseError {
  constructor() {
    super('CART_ID_REQUIRED', 'Id giỏ hàng là bắt buộc');
  }
}

export class CartNotActiveError extends BaseError {
  constructor() {
    super('CART_NOT_ACTIVE', 'Giỏ hàng không ở trạng thái hoạt động');
  }
}

export class CartItemNotFoundError extends BaseError {
  constructor() {
    super('CART_ITEM_NOT_FOUND', 'Sản phẩm trong giỏ hàng không tồn tại');
  }
}

export class CartCheckedOutCannotExpireError extends BaseError {
  constructor() {
    super('CART_CHECKED_OUT_CANNOT_EXPIRE', 'Giỏ hàng đã checkout không thể hết hạn');
  }
}

export class CartEmptyError extends BaseError {
  constructor() {
    super('CART_EMPTY', 'Giỏ hàng đang trống');
  }
}

export class OnlyActiveCartCanBeMergedError extends BaseError {
  constructor() {
    super('ONLY_ACTIVE_CART_CAN_BE_MERGED', 'Chỉ giỏ hàng đang hoạt động mới có thể merge');
  }
}

export class InvalidCartItemQuantityError extends BaseError {
  constructor() {
    super('INVALID_CART_ITEM_QUANTITY', 'Số lượng sản phẩm phải lớn hơn hoặc bằng 0');
  }
}

export class QuantityExceedsStockError extends BaseError {
  constructor() {
    super('QUANTITY_EXCEEDS_STOCK', 'Số lượng vượt quá tồn kho hiện tại');
  }
}

export class ProductOutOfStockError extends BaseError {
  constructor() {
    super('PRODUCT_OUT_OF_STOCK', 'Sản phẩm đã hết hàng');
  }
}

export class ProductNotFoundInCartError extends BaseError {
  constructor() {
    super('PRODUCT_NOT_FOUND_IN_CART', 'Sản phẩm không tồn tại');
  }
}

export class CartNotFoundError extends BaseError {
  constructor() {
    super('CART_NOT_FOUND', 'Giỏ hàng không tồn tại');
  }
}
