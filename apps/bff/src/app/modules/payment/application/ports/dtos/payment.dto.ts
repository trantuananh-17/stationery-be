export type CreatePaymentIntentGrpcRequest = {
  orderId: string;
  userId: string;
};

export type CreatePaymentIntentGrpcResponse = {
  orderId: string;
  clientEmail: string;
  totalItem: number;
  totalPrice: number;
  subTotal: number;
  shippingCost: number;
  clientSecret: string;
  paymentIntentId: string;
};
