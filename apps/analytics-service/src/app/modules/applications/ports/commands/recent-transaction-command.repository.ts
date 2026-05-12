import { RecentTransaction } from '../../../domain/entities/recent-transaction.entity';

export abstract class IRecentTransactionCommandRepository {
  abstract findByOrderId(orderId: string): Promise<RecentTransaction | null>;

  abstract save(transaction: RecentTransaction): Promise<void>;
}
