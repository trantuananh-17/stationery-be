import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecentTransactionsQuery } from './get-recent-transactions.query';
import { IRecentTransactionQueryRepository } from '../../ports/queries/recent-transaction-query.repository';
import { toTimestamp } from '@common/utils/common.util';

@QueryHandler(GetRecentTransactionsQuery)
export class GetRecentTransactionsHandler implements IQueryHandler<GetRecentTransactionsQuery> {
  constructor(private readonly repository: IRecentTransactionQueryRepository) {}

  async execute(query: GetRecentTransactionsQuery) {
    const results = await this.repository.getRecent(query.limit);

    return {
      data: results.map((result) => ({
        orderId: result.orderId,
        customerName: result.customerName,
        totalAmount: result.totalAmount,
        totalItems: result.totalItems,
        status: result.status,
        orderedAt: toTimestamp(result.orderedAt),
      })),
    };
  }
}
