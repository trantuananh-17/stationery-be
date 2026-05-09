import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ILastOrderCommandRepository } from '../../application/ports/repositories/last-order-command.repo';
import { LastOrder, LastOrderItem } from '../../domain/entities/last-order.entity';
import { LastOrderOrmEntity } from '../entities/typeorm-last-order.entity';

@Injectable()
export class TypeormLastOrderRepository implements ILastOrderCommandRepository {
  constructor(
    @InjectRepository(LastOrderOrmEntity)
    private readonly repo: Repository<LastOrderOrmEntity>,
  ) {}

  async upsert(snapshot: LastOrder): Promise<void> {
    await this.repo.upsert(this._toOrm(snapshot), ['userId']);
  }

  async findByUserId(userId: string): Promise<LastOrder | null> {
    const entity = await this.repo.findOne({
      where: { userId },
    });

    if (!entity) return null;

    return this._toDomain(entity);
  }

  private _toDomain(orm: LastOrderOrmEntity): LastOrder {
    return new LastOrder({
      id: orm.id,
      userId: orm.userId,
      orderId: orm.orderId,
      orderNumber: orm.orderNumber,
      totalPrice: Number(orm.totalPrice),
      orderStatus: orm.orderStatus,
      paymentStatus: orm.paymentStatus,
      orderedAt: orm.orderedAt,
      items: orm.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: item.sku,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
        attributes: (item.attributes ?? []).map((attribute) => ({
          name: attribute.name,
          value: attribute.value,
        })),
      })),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private _toOrm(domain: LastOrder): Partial<LastOrderOrmEntity> {
    return {
      id: domain.id,
      userId: domain.userId,
      orderId: domain.orderId,
      orderNumber: domain.orderNumber,
      totalPrice: domain.totalPrice,
      orderStatus: domain.orderStatus,
      paymentStatus: domain.paymentStatus,
      orderedAt: domain.orderedAt,
      items: domain.items.map(
        (item): LastOrderItem => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.sku,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          attributes: item.attributes.map((attribute) => ({
            name: attribute.name,
            value: attribute.value,
          })),
        }),
      ),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
