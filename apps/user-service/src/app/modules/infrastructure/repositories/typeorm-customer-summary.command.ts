import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICustomerSummaryCommandRepository } from '../../application/ports/repositories/customer-summary-command.repo';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomerSummaryOrmEntity } from '../entities/typeorm-customer-summary.entity';

@Injectable()
export class TypeormCustomerSummaryRepository implements ICustomerSummaryCommandRepository {
  constructor(
    @InjectRepository(CustomerSummaryOrmEntity)
    private readonly repo: Repository<CustomerSummaryOrmEntity>,
  ) {}

  async create(summary: CustomerSummary): Promise<void> {
    await this.repo.insert(this._toCustomerSummaryOrm(summary));
  }

  async update(summary: CustomerSummary): Promise<void> {
    await this.repo.update({ userId: summary.userId }, this._toCustomerSummaryOrm(summary));
  }

  async upsert(summary: CustomerSummary): Promise<void> {
    await this.repo.upsert(this._toCustomerSummaryOrm(summary), ['userId']);
  }

  async findByUserId(userId: string): Promise<CustomerSummary | null> {
    const entity = await this.repo.findOne({
      where: { userId },
    });

    if (!entity) return null;

    return this._toDomain(entity);
  }

  private _toDomain(orm: CustomerSummaryOrmEntity): CustomerSummary {
    return new CustomerSummary({
      id: orm.id,
      userId: orm.userId,
      email: orm.email,
      isActive: orm.isActive,
      isVerified: orm.isVerified,
      totalOrders: orm.totalOrders,
      amountSpent: Number(orm.amountSpent),
      lastOrderId: orm.lastOrderId,
      lastOrderTotal:
        orm.lastOrderTotal !== null && orm.lastOrderTotal !== undefined
          ? Number(orm.lastOrderTotal)
          : undefined,
      lastOrderAt: orm.lastOrderAt,
      customerSince: orm.customerSince,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private _toCustomerSummaryOrm(domain: CustomerSummary): Partial<CustomerSummaryOrmEntity> {
    return {
      id: domain.id,
      userId: domain.userId,
      email: domain.email,
      isActive: domain.isActive,
      isVerified: domain.isVerified,
      totalOrders: domain.totalOrders,
      amountSpent: domain.amountSpent,
      lastOrderId: domain.lastOrderId,
      lastOrderTotal: domain.lastOrderTotal,
      lastOrderAt: domain.lastOrderAt,
      customerSince: domain.customerSince,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
