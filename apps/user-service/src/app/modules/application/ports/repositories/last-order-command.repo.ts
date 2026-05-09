import { LastOrder } from '../../../domain/entities/last-order.entity';

export abstract class ILastOrderCommandRepository {
  abstract upsert(snapshot: LastOrder): Promise<void>;

  abstract findByUserId(userId: string): Promise<LastOrder | null>;
}
