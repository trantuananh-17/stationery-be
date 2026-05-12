import { RecentTransactionStatus } from '../../../domain/entities/recent-transaction.entity';

export class RecentTransactionDto {
  orderId: string;

  customerName: string;

  totalAmount: number;

  totalItems: number;

  status: RecentTransactionStatus;

  orderedAt: Date;
}
