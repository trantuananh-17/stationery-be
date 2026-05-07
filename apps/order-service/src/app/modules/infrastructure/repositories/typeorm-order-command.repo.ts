import { getManager } from '@common/utils/get-manager.util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IOrderCommandRepository } from '../../application/ports/repositories/order-command.repo';

import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

import { OrderOrmEntity } from '../entities/typeorm-order.entity';
import { OrderItemOrmEntity } from '../entities/typeorm-order-item.entity';

import { ItemInput } from '../../application/ports/producers/event-publisher.port';

@Injectable()
export class TypeOrmOrderCommandRepository implements IOrderCommandRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderRepo: Repository<OrderOrmEntity>,

    @InjectRepository(OrderItemOrmEntity)
    private readonly orderItemRepo: Repository<OrderItemOrmEntity>,
  ) {}

  async findById(orderId: string): Promise<Order | null> {
    const orm = await this.orderRepo.findOne({
      where: {
        id: orderId,
      },
      relations: {
        items: true,
      },
    });

    if (!orm) {
      return null;
    }

    const items = orm.items.map((item) =>
      OrderItem.restore({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        name: item.name,
        sku: item.sku ?? undefined,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        image: item.image ?? undefined,
        attributes: item.attributes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );

    return Order.restore(
      {
        id: orm.id,
        number: orm.number,
        userId: orm.userId,
        email: orm.email,
        status: orm.status,
        shippingAddress: orm.shippingAddress,
        billingAddress: orm.billingAddress,
        paymentMethod: orm.paymentMethod,
        paymentStatus: orm.paymentStatus,
        paymentTransactionId: orm.paymentTransactionId ?? undefined,
        paymentProvider: orm.paymentProvider ?? undefined,
        paymentExpiredAt: orm.paymentExpiredAt ?? undefined,
        subtotal: orm.subtotal,
        tax: orm.tax,
        shippingCost: orm.shippingCost,
        discount: orm.discount,
        total: orm.total,
        notes: orm.notes ?? undefined,
        trackingNumber: orm.trackingNumber ?? undefined,
        shippingProvider: orm.shippingProvider ?? undefined,
        shippedAt: orm.shippedAt ?? undefined,
        deliveredAt: orm.deliveredAt ?? undefined,
        cancelledAt: orm.cancelledAt ?? undefined,
        paidAt: orm.paidAt ?? undefined,
        estimatedDelivery: orm.estimatedDelivery ?? undefined,
        createdAt: orm.createdAt,
        updatedAt: orm.updatedAt,
      },
      items,
    );
  }

  async getOrderItemInput(orderId: string): Promise<ItemInput[]> {
    const items = await this.orderItemRepo.find({
      where: { orderId },
      select: ['variantId', 'quantity'],
    });

    return items
      .filter((item) => item.variantId)
      .map((item) => ({
        variantId: item.variantId as string,
        quantity: item.quantity,
      }));
  }

  async save(order: Order): Promise<void> {
    const manager = getManager();

    const orderRepo = manager ? manager.getRepository(OrderOrmEntity) : this.orderRepo;
    const orderItemRepo = manager ? manager.getRepository(OrderItemOrmEntity) : this.orderItemRepo;
    const orderOrm = this._toOrderOrm(order);
    const itemOrms = order.getItems().map((item) => this._toOrderItemOrm(item));
    await orderRepo.save(orderOrm);

    await this.syncOrderItems(order.id, itemOrms, orderItemRepo);
  }

  private async syncOrderItems(
    orderId: string,
    nextItems: OrderItemOrmEntity[],
    orderItemRepo: Repository<OrderItemOrmEntity>,
  ): Promise<void> {
    const existingItems = await orderItemRepo.find({
      where: { orderId },
      select: ['id'],
    });

    const nextItemIds = new Set(nextItems.map((item) => item.id));

    const itemIdsToDelete = existingItems
      .filter((item) => !nextItemIds.has(item.id))
      .map((item) => item.id);

    if (nextItems.length > 0) {
      await orderItemRepo.save(nextItems);
    }

    if (itemIdsToDelete.length > 0) {
      await orderItemRepo.delete(itemIdsToDelete);
    }
  }

  private _toOrderOrm(order: Order): OrderOrmEntity {
    const orm = new OrderOrmEntity();

    orm.id = order.id;
    orm.number = order.number;
    orm.userId = order.userId;
    orm.email = order.email;
    orm.status = order.status;
    orm.shippingAddress = order.shippingAddress;
    orm.billingAddress = order.billingAddress;
    orm.paymentMethod = order.paymentMethod;
    orm.paymentStatus = order.paymentStatus;
    orm.paymentTransactionId = order.paymentTransactionId ?? undefined;
    orm.paymentProvider = order.paymentProvider ?? undefined;
    orm.paymentExpiredAt = order.paymentExpiredAt ?? undefined;
    orm.paidAt = order.paidAt ?? undefined;
    orm.subtotal = order.subtotal;
    orm.tax = order.tax;
    orm.shippingCost = order.shippingCost;
    orm.discount = order.discount;
    orm.total = order.total;
    orm.notes = order.notes ?? undefined;
    orm.trackingNumber = order.trackingNumber ?? undefined;
    orm.shippingProvider = order.shippingProvider ?? undefined;
    orm.shippedAt = order.shippedAt ?? undefined;
    orm.deliveredAt = order.deliveredAt ?? undefined;
    orm.cancelledAt = order.cancelledAt ?? undefined;
    orm.estimatedDelivery = order.estimatedDelivery ?? undefined;
    orm.createdAt = order.createdAt;
    orm.updatedAt = order.updatedAt;

    return orm;
  }

  private _toOrderItemOrm(item: OrderItem): OrderItemOrmEntity {
    const orm = new OrderItemOrmEntity();

    orm.id = item.id;
    orm.orderId = item.orderId;
    orm.productId = item.productId;
    orm.variantId = item.variantId ?? undefined;
    orm.name = item.name;
    orm.sku = item.sku ?? undefined;
    orm.price = item.price;
    orm.quantity = item.quantity;
    orm.subtotal = item.subtotal;
    orm.image = item.image ?? undefined;
    orm.attributes = item.attributes;
    orm.createdAt = item.createdAt;
    orm.updatedAt = item.updatedAt;

    return orm;
  }
}
