export interface CreateCheckoutSessionRequest {
  lineItems: {
    price: number;
    quantity: number;
    name: string;
  }[];
  orderId: string;
  clientEmail: string;
}

export interface CreatePaymentRequest {
  userId: string;
  orderId: string;
}
