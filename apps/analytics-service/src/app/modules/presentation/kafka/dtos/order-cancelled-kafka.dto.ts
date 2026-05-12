export class OrderCancelledKafkaDto {
  eventId: string;

  orderId: string;

  customerId: string;

  totalAmount: number;

  cancelledAt: string;
}
