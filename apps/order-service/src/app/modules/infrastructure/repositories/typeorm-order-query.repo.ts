import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPaymentDto } from '../../application/queries/get-order-checkout/get-order-payment.dto';
import { OrderOrmEntity } from '../entities/typeorm-order.entity';
import { OrderItemOrmEntity } from '../entities/typeorm-order-item.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { IOrderQueryRepository } from '../../application/ports/repositories/order-query.repo';
import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { OrderAdminDto } from '../../application/queries/get-orders-admin/get-orders-admin.dto';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

@Injectable()
export class TypeOrmOrderQueryRepository implements IOrderQueryRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderRepository: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly orderItemRepository: Repository<OrderItemOrmEntity>,
  ) {}

  async getPayment(userId: string, orderId: string): Promise<OrderPaymentDto | null> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatus.PENDING })
      .getOne();

    if (!order) {
      return null;
    }

    const lineItems = order.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? null,
      name: item.name,
      sku: item.sku ?? undefined,
      image: item.image ?? undefined,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    return {
      orderId: order.id,
      orderNumber: order.number,
      userId: order.userId,
      email: order.email,
      totalItems: lineItems.reduce((sum, item) => sum + item.quantity, 0),
      lineItems,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      paymentExpiredAt: order.paymentExpiredAt ?? undefined,
    };
  }

  async findAll(filters: {
    search?: string;
    status?: OrderStatus;
    page: number;
    limit: number;
  }): Promise<QueryResult<OrderAdminDto>> {
    const { search, status, page, limit } = filters;

    const qb = this.orderRepository
      .createQueryBuilder('o')
      .leftJoin(
        (subQuery) =>
          subQuery
            .select(['oi.order_id AS order_id', 'oi.name AS product_name'])
            .from(OrderItemOrmEntity, 'oi')
            .distinctOn(['oi.order_id'])
            .orderBy('oi.order_id')
            .addOrderBy('oi.created_at', 'ASC'),
        'first_item',
        'first_item.order_id = o.id',
      );

    if (search?.trim()) {
      qb.andWhere(
        `
      LOWER(o.number) LIKE LOWER(:search)
      `,
        {
          search: `%${search.trim()}%`,
        },
      );
    }

    if (status) {
      qb.andWhere('o.status = :status', {
        status,
      });
    }

    const total = await qb.clone().getCount();

    qb.select([
      'o.id AS id',

      'o.number AS "orderNumber"',

      `
    CONCAT(
      o.shipping_address->>'firstName',
      ' ',
      o.shipping_address->>'lastName'
    ) AS "customerName"
    `,

      'o.email AS "customerEmail"',

      'first_item.product_name AS "productName"',

      'o.status AS status',

      'o.payment_status AS "paymentStatus"',

      'o.total AS total',

      'o.created_at AS "createdAt"',
    ]);

    qb.orderBy('o.created_at', 'DESC');

    qb.offset((page - 1) * limit).limit(limit);

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        orderNumber: r.orderNumber,
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        productName: r.productName,
        status: r.status,
        paymentStatus: r.paymentStatus,
        total: Number(r.total),
        createdAt: new Date(r.createdAt),
      })),
      total,
    };
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },

      relations: {
        items: true,
      },
    });

    if (!order) {
      return null;
    }

    return this._toDomain(order);
  }

  async findByIdAndUserId(orderId: string, userId: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        userId,
      },

      relations: {
        items: true,
      },
    });

    if (!order) {
      return null;
    }

    return this._toDomain(order);
  }

  private _toDomain(orm: OrderOrmEntity): Order {
    const items =
      orm.items?.map((item) =>
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
      ) ?? [];

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
        paidAt: orm.paidAt ?? undefined,
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
        estimatedDelivery: orm.estimatedDelivery ?? undefined,
        createdAt: orm.createdAt,
        updatedAt: orm.updatedAt,
      },
      items,
    );
  }
}
