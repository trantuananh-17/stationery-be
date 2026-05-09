import { ICommand } from '@nestjs/cqrs';

export class UpsertLastOrderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly totalPrice: number,
    public readonly orderStatus: string,
    public readonly paymentStatus: string,
    public readonly orderedAt: Date,
    public readonly items: {
      productId: string;
      variantId?: string;
      name: string;
      sku?: string;
      thumbnail?: string;
      quantity: number;
      price: number;
      subtotal: number;
      attributes: {
        name: string;
        value: string;
      }[];
    }[],
  ) {}
}
