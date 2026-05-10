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
import { OrderSort } from '../../domain/enums/order-sort.enum';
import { CustomerOrderDetail } from '../../application/queries/get-my-orders/get-my-orders.dto';

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
    orderBy?: OrderSort;
    page: number;
    limit: number;
  }): Promise<QueryResult<OrderAdminDto>> {
    const { search, status, orderBy, page, limit } = filters;

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

    switch (orderBy) {
      case OrderSort.PRICE_ASC:
        qb.orderBy('o.total', 'ASC');
        break;

      case OrderSort.PRICE_DESC:
        qb.orderBy('o.total', 'DESC');
        break;

      case OrderSort.CREATED_AT_ASC:
        qb.orderBy('o.created_at', 'ASC');
        break;

      case OrderSort.CREATED_AT_DESC:
        qb.orderBy('o.created_at', 'DESC');
        break;

      default:
        qb.orderBy('o.created_at', 'DESC');
    }

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

  async findOrdersByUserId(
    userId: string,
    filters: {
      status?: OrderStatus;
      page: number;
      limit: number;
    },
  ): Promise<QueryResult<CustomerOrderDetail>> {
    const { status, page, limit } = filters;

    const qb = this.orderRepository
      .createQueryBuilder('o')
      .where('o.user_id = :userId', { userId });

    if (status) {
      qb.andWhere('o.status = :status', { status });
    }

    const total = await qb.clone().getCount();

    qb.select([
      'o.id AS id',
      'o.number AS "orderNumber"',
      'o.status AS status',
      'o.payment_status AS "paymentStatus"',
      'o.payment_method AS "paymentMethod"',
      'o.subtotal AS subtotal',
      'o.shipping_cost AS "shippingCost"',
      'o.discount AS discount',
      'o.total AS total',
      'o.tracking_number AS "trackingNumber"',
      'o.shipping_provider AS "shippingProvider"',
      'o.shipping_address AS "shippingAddress"',
      'o.estimated_delivery AS "estimatedDelivery"',
      'o.paid_at AS "paidAt"',
      'o.shipped_at AS "shippedAt"',
      'o.delivered_at AS "deliveredAt"',
      'o.cancelled_at AS "cancelledAt"',
      'o.created_at AS "createdAt"',
    ])
      .orderBy('o.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const orderRaws = await qb.getRawMany();

    if (!orderRaws.length) {
      return {
        items: [],
        total,
      };
    }

    const orderIds = orderRaws.map((order) => order.id);

    const itemRaws = await this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id AS id',
        'oi.order_id AS "orderId"',
        'oi.product_id AS "productId"',
        'oi.variant_id AS "variantId"',
        'oi.name AS name',
        'oi.sku AS sku',
        'oi.image AS image',
        'oi.price AS price',
        'oi.quantity AS quantity',
        'oi.subtotal AS subtotal',
        'oi.attributes AS attributes',
      ])
      .where('oi.order_id IN (:...orderIds)', { orderIds })
      .orderBy('oi.created_at', 'ASC')
      .getRawMany();

    const itemsByOrderId = itemRaws.reduce<Record<string, CustomerOrderDetail['items']>>(
      (acc, item) => {
        if (!acc[item.orderId]) {
          acc[item.orderId] = [];
        }

        acc[item.orderId].push({
          id: item.id,
          productId: item.productId,
          variantId: item.variantId ?? undefined,
          name: item.name,
          sku: item.sku ?? undefined,
          image: item.image ?? undefined,
          price: Number(item.price),
          quantity: Number(item.quantity),
          subtotal: Number(item.subtotal),
          attributes: item.attributes ?? [],
        });

        return acc;
      },
      {},
    );

    return {
      items: orderRaws.map((order) => {
        const items = itemsByOrderId[order.id] ?? [];

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          subtotal: Number(order.subtotal),
          shippingCost: Number(order.shippingCost),
          discount: Number(order.discount),
          total: Number(order.total),
          trackingNumber: order.trackingNumber ?? undefined,
          shippingProvider: order.shippingProvider ?? undefined,
          shippingAddress: order.shippingAddress,
          items,
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          totalUniqueItems: items.length,
          estimatedDelivery: order.estimatedDelivery
            ? new Date(order.estimatedDelivery)
            : undefined,
          paidAt: order.paidAt ? new Date(order.paidAt) : undefined,
          shippedAt: order.shippedAt ? new Date(order.shippedAt) : undefined,
          deliveredAt: order.deliveredAt ? new Date(order.deliveredAt) : undefined,
          cancelledAt: order.cancelledAt ? new Date(order.cancelledAt) : undefined,
          createdAt: new Date(order.createdAt),
        };
      }),
      total,
    };
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
