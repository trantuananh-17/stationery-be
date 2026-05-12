export class OrderPaidKafkaItemDto {
  productId: string;

  productName: string;

  categoryId: string;

  categoryName: string;

  quantity: number;

  subtotal: number;
}

export class OrderPaidKafkaDto {
  eventId: string;

  orderId: string;

  customerId: string;

  totalAmount: number;

  totalItems: number;

  paidAt: string;

  items: OrderPaidKafkaItemDto[];
}
