import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RecentTransactionOrmEntity } from '../../entities/recent-transaction.orm-entity';
import { IRecentTransactionCommandRepository } from '../../../applications/ports/commands/recent-transaction-command.repository';
import { RecentTransaction } from '../../../domain/entities/recent-transaction.entity';

@Injectable()
export class TypeOrmRecentTransactionCommandRepository
  implements IRecentTransactionCommandRepository
{
  constructor(
    @InjectRepository(RecentTransactionOrmEntity)
    private readonly repo: Repository<RecentTransactionOrmEntity>,
  ) {}

  async findByOrderId(orderId: string): Promise<RecentTransaction | null> {
    const entity = await this.repo.findOne({
      where: {
        orderId,
      },
    });

    if (!entity) {
      return null;
    }

    return RecentTransaction.restore({
      id: entity.id,

      orderId: entity.orderId,

      customerId: entity.customerId,

      customerName: entity.customerName,

      totalAmount: Number(entity.totalAmount),

      totalItems: entity.totalItems,

      status: entity.status,

      orderedAt: entity.orderedAt,

      updatedAt: entity.updatedAt,
    });
  }

  async save(transaction: RecentTransaction): Promise<void> {
    await this.repo.save({
      id: transaction.id,

      orderId: transaction.orderId,

      customerId: transaction.customerId,

      customerName: transaction.customerName,

      totalAmount: transaction.totalAmount,

      totalItems: transaction.totalItems,

      status: transaction.status,

      orderedAt: transaction.orderedAt,

      createdAt: transaction.orderedAt,

      updatedAt: transaction.updatedAt,
    });
  }
}
