export type CheckoutGrpcRequest = {
  userId: string;
  email: string;
  shippingAddress: CheckoutAddressGrpc;
  billingAddress: CheckoutAddressGrpc;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
};

export type CheckoutAddressGrpc = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  phone?: string;
};

export type CheckoutGrpcResponse = {
  success: boolean;

  code?: 'STOCK_RESERVATION_FAILED' | 'CART_EMPTY';
  message?: string;

  orderId?: string;
  orderNumber?: string;

  subtotal?: number;
  total?: number;

  status?: string;
  paymentStatus?: string;

  stockItems: CheckoutStockItemGrpc[];
};

export type CheckoutStockItemGrpc = {
  variantId: string;
  requestedQuantity: number;
  success: boolean;
  status: 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';
  availableStock: number;
  remainingStock: number;
  message?: string;
};
