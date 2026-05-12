import { Controller } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';

import { EventPattern, Payload } from '@nestjs/microservices';

import { OrderCreatedKafkaDto } from './dtos/order-created-kafka.dto';

import { OrderPaidKafkaDto } from './dtos/order-paid-kafka.dto';

import { OrderProcessingKafkaDto } from './dtos/order-processing-kafka.dto';

import { OrderShippedKafkaDto } from './dtos/order-shipped-kafka.dto';

import { OrderDeliveredKafkaDto } from './dtos/order-delivered-kafka.dto';

import { OrderCancelledKafkaDto } from './dtos/order-cancelled-kafka.dto';

import {
  DailyMetricAction,
  DailyMetricCommand,
} from '../../applications/commands/daily-metric/daily-metric.command';

import {
  SalesPerformanceAction,
  SalesPerformanceCommand,
} from '../../applications/commands/sales-performance/sales-performance.command';

import {
  GoalTrackingAction,
  GoalTrackingCommand,
} from '../../applications/commands/goal-tracking/goal-tracking.command';

import {
  ProductPerformanceAction,
  ProductPerformanceCommand,
} from '../../applications/commands/product-performance/product-performance.command';

import {
  CategoryPerformanceAction,
  CategoryPerformanceCommand,
} from '../../applications/commands/category-performance/category-performance.command';

import {
  OrderStatusMetricAction,
  OrderStatusMetricCommand,
} from '../../applications/commands/order-status-metric/order-status-metric.command';

import {
  RecentTransactionAction,
  RecentTransactionCommand,
} from '../../applications/commands/recent-transaction/recent-transaction.command';

import { RecentTransactionStatus } from '../../domain/entities/recent-transaction.entity';

@Controller()
export class OrderConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload()
    payload: OrderCreatedKafkaDto,
  ) {
    const date = payload.createdAt.split('T')[0];

    await this.commandBus.execute(
      new OrderStatusMetricCommand(
        OrderStatusMetricAction.ORDER_CREATED,

        date,
      ),
    );

    await this.commandBus.execute(
      new RecentTransactionCommand(
        RecentTransactionAction.CREATE,

        payload.orderId,

        payload.customerId,

        payload.customerName,

        payload.totalAmount,

        payload.totalItems,

        undefined,

        new Date(payload.createdAt),
      ),
    );
  }

  @EventPattern('order.paid')
  async handleOrderPaid(
    @Payload()
    payload: OrderPaidKafkaDto,
  ) {
    const date = payload.paidAt.split('T')[0];

    const month = payload.paidAt.slice(0, 7);

    await this.commandBus.execute(
      new DailyMetricCommand(
        DailyMetricAction.ORDER_PAID,

        date,

        payload.totalAmount,
      ),
    );

    await this.commandBus.execute(
      new SalesPerformanceCommand(
        SalesPerformanceAction.ORDER_PAID,

        date,

        payload.totalAmount,

        1,

        payload.totalAmount * 0.7,
      ),
    );

    await this.commandBus.execute(
      new GoalTrackingCommand(
        GoalTrackingAction.ORDER_PAID,

        month,

        payload.totalAmount,

        1,
      ),
    );

    for (const item of payload.items) {
      await this.commandBus.execute(
        new ProductPerformanceCommand(
          ProductPerformanceAction.ORDER_PAID,

          date,

          item.productId,

          item.productName,

          item.categoryId,

          item.categoryName,

          item.quantity,

          item.subtotal,
        ),
      );

      await this.commandBus.execute(
        new CategoryPerformanceCommand(
          CategoryPerformanceAction.ORDER_PAID,

          date,

          item.categoryId,

          item.categoryName,

          item.quantity,

          item.subtotal,
        ),
      );
    }
  }

  @EventPattern('order.processing')
  async handleOrderProcessing(
    @Payload()
    payload: OrderProcessingKafkaDto,
  ) {
    const date = payload.processedAt.split('T')[0];

    await this.commandBus.execute(
      new OrderStatusMetricCommand(
        OrderStatusMetricAction.ORDER_PROCESSING,

        date,
      ),
    );

    await this.commandBus.execute(
      new RecentTransactionCommand(
        RecentTransactionAction.UPDATE_STATUS,

        payload.orderId,

        undefined,

        undefined,

        undefined,

        undefined,

        RecentTransactionStatus.PROCESSING,
      ),
    );
  }

  @EventPattern('order.shipped')
  async handleOrderShipped(
    @Payload()
    payload: OrderShippedKafkaDto,
  ) {
    const date = payload.shippedAt.split('T')[0];

    await this.commandBus.execute(
      new OrderStatusMetricCommand(
        OrderStatusMetricAction.ORDER_SHIPPED,

        date,
      ),
    );

    await this.commandBus.execute(
      new RecentTransactionCommand(
        RecentTransactionAction.UPDATE_STATUS,

        payload.orderId,

        undefined,

        undefined,

        undefined,

        undefined,

        RecentTransactionStatus.SHIPPED,
      ),
    );
  }

  @EventPattern('order.delivered')
  async handleOrderDelivered(
    @Payload()
    payload: OrderDeliveredKafkaDto,
  ) {
    const date = payload.deliveredAt.split('T')[0];

    await this.commandBus.execute(
      new OrderStatusMetricCommand(
        OrderStatusMetricAction.ORDER_DELIVERED,

        date,
      ),
    );

    await this.commandBus.execute(
      new RecentTransactionCommand(
        RecentTransactionAction.UPDATE_STATUS,

        payload.orderId,

        undefined,

        undefined,

        undefined,

        undefined,

        RecentTransactionStatus.DELIVERED,
      ),
    );
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload()
    payload: OrderCancelledKafkaDto,
  ) {
    const date = payload.cancelledAt.split('T')[0];

    await this.commandBus.execute(
      new OrderStatusMetricCommand(
        OrderStatusMetricAction.ORDER_CANCELLED,

        date,
      ),
    );

    await this.commandBus.execute(
      new RecentTransactionCommand(
        RecentTransactionAction.UPDATE_STATUS,

        payload.orderId,

        undefined,

        undefined,

        undefined,

        undefined,

        RecentTransactionStatus.CANCELLED,
      ),
    );
  }
}
