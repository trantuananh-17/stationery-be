import { RecentTransactionStatus } from '../../../domain/entities/recent-transaction.entity';

export enum RecentTransactionAction {
  CREATE = 'CREATE',

  UPDATE_STATUS = 'UPDATE_STATUS',
}

export class RecentTransactionCommand {
  constructor(
    public readonly type: RecentTransactionAction,

    public readonly orderId: string,

    public readonly customerId?: string,

    public readonly customerName?: string,

    public readonly totalAmount?: number,

    public readonly totalItems?: number,

    public readonly status?: RecentTransactionStatus,

    public readonly orderedAt?: Date,
  ) {}
}
