import { Order } from '../../../domain/entities/order.entity';

export abstract class IOrderCommandRepository {
  abstract save(order: Order): Promise<void>;
}
