export interface CreateCheckoutSessionRequest {
  lineItems: {
    price: number;
    quantity: number;
    name: string;
  }[];
  orderId: string;
  clientEmail: string;
}
