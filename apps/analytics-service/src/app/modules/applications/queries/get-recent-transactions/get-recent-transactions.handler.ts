import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetRecentTransactionsQuery } from './get-recent-transactions.query';
import { IRecentTransactionQueryRepository } from '../../ports/queries/recent-transaction-query.repository';

@QueryHandler(GetRecentTransactionsQuery)
export class GetRecentTransactionsHandler implements IQueryHandler<GetRecentTransactionsQuery> {
  constructor(private readonly repository: IRecentTransactionQueryRepository) {}

  async execute(query: GetRecentTransactionsQuery) {
    return this.repository.getRecent(query.limit);
  }
}
