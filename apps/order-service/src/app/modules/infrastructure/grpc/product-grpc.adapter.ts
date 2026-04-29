import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { IProductGrpcPort } from '../../application/ports/grpc/product-grpc.port';
import { IProductGrpcService } from './product-grpc.interface';
import { ReserveStockResponse } from '../../application/ports/contracts/product.contract';

@Injectable()
export class ProductGrpcAdapter implements IProductGrpcPort, OnModuleInit {
  private productService: IProductGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.PRODUCT_SERVICE)
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.productService = this.userClient.getService<IProductGrpcService>('ProductService');
  }

  reserveStock(data: {
    items: { variantId: string; quantity: number }[];
  }): Promise<ReserveStockResponse> {
    return firstValueFrom(this.productService.reserveStock(data));
  }
}
