import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RecentTransactionOrmEntity } from '../../entities/recent-transaction.orm-entity';
import { IRecentTransactionQueryRepository } from '../../../applications/ports/queries/recent-transaction-query.repository';
import { RecentTransactionDto } from '../../../applications/ports/dtos/recent-transaction.dto';

@Injectable()
export class TypeOrmRecentTransactionQueryRepository implements IRecentTransactionQueryRepository {
  constructor(
    @InjectRepository(RecentTransactionOrmEntity)
    private readonly repo: Repository<RecentTransactionOrmEntity>,
  ) {}

  async getRecent(limit: number): Promise<RecentTransactionDto[]> {
    const entities = await this.repo.find({
      take: limit,

      order: {
        orderedAt: 'DESC',
      },
    });

    return entities.map((entity) => ({
      orderId: entity.orderId,

      customerName: entity.customerName,

      totalAmount: Number(entity.totalAmount),

      totalItems: entity.totalItems,

      status: entity.status,

      orderedAt: entity.orderedAt,
    }));
  }
}
