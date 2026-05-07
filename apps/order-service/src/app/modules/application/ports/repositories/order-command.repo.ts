import { Order } from '../../../domain/entities/order.entity';
import { ItemInput } from '../producers/event-publisher.port';

export abstract class IOrderCommandRepository {
  abstract save(order: Order): Promise<void>;

  abstract getOrderItemInput(orderId: string): Promise<ItemInput[]>;

  abstract findById(orderId: string): Promise<Order | null>;
}
