import { BadRequestException, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetOrderPaymentQuery } from './get-order-payment.query';
import { OrderPaymentDto } from './get-order-payment.dto';
import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { IOrderQueryRepository } from '../../ports/repositories/order-query.repo';

@QueryHandler(GetOrderPaymentQuery)
export class GetOrderPaymentHandler
  implements IQueryHandler<GetOrderPaymentQuery, OrderPaymentDto>
{
  constructor(
    @Inject(IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
  ) {}

  async execute(query: GetOrderPaymentQuery): Promise<OrderPaymentDto> {
    const payment = await this.orderQueryRepository.getPayment(query.userId, query.orderId);

    console.log(payment);

    if (!payment) {
      throw new NotFoundException('Order payment not found');
    }

    if (payment.status !== OrderStatus.PENDING) {
      throw new ConflictException('Order is not payable');
    }

    if (payment.paymentStatus === PaymentStatus.PAID) {
      throw new ConflictException('Order already paid');
    }

    if (payment.paymentExpiredAt && payment.paymentExpiredAt.getTime() <= Date.now()) {
      throw new ConflictException('Order payment expired');
    }

    if (payment.total <= 0) {
      throw new BadRequestException('Invalid order total');
    }

    if (!payment.lineItems.length) {
      throw new BadRequestException('Order has no items');
    }

    return payment;
  }
}
