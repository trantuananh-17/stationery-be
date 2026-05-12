import { RecentTransactionDto } from '../dtos/recent-transaction.dto';

export abstract class IRecentTransactionQueryRepository {
  abstract getRecent(limit: number): Promise<RecentTransactionDto[]>;
}
