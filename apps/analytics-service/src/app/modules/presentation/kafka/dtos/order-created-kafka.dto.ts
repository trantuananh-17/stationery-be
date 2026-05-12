export class OrderCreatedKafkaDto {
  eventId: string;

  orderId: string;

  customerId: string;

  customerName: string;

  totalAmount: number;

  totalItems: number;

  createdAt: string;
}
