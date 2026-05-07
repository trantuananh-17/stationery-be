import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  OrderPaymentGrpcRequest,
  OrderPaymentResponse,
} from '../../applications/ports/dtos/order.dto';
import { OrderPort } from '../../applications/ports/order.port';
import { OrderGrpcService } from './order-grpc.interface';

@Injectable()
export class OrderGrpcAdapter implements OrderPort, OnModuleInit {
  private orderService: OrderGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.ORDER_SERVICE)
    private readonly orderClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.orderService = this.orderClient.getService<OrderGrpcService>('OrderService');
  }

  getOrderPayment(data: OrderPaymentGrpcRequest): Promise<OrderPaymentResponse> {
    return firstValueFrom(this.orderService.getOrderPayment(data));
  }
}
