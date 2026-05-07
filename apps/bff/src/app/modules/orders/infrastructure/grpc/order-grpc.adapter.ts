import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPort } from '../../applications/ports/order.port';
import { OrderGrpcService } from './order-grpc.interface';
import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetOrdersAdminGrpcRequest,
  OrdersAdminGrpcResponse,
} from '../../applications/ports/dtos/order.dto';

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

  checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse> {
    return firstValueFrom(this.orderService.checkout(data));
  }

  getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse> {
    return firstValueFrom(this.orderService.getOrdersAdmin(data));
  }
}
