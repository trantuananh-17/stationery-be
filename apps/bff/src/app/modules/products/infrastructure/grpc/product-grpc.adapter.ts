import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ProductPort } from '../../application/ports/product.port';
import {
  CreateProductBodyDto,
  GetProductByIdBodyDto,
  GetProductBySlugBodyDto,
  GetProductsBodyDto,
  GetProductsResponse,
  ProductCartItemResponse,
  ProductIdResponse,
  ProductInfoResponse,
  ReserveStockBodyDto,
  ReserveStockResponse,
  UpdateProductBodyDto,
} from '../../application/ports/dtos/product.dto';

import { ProductGrpcService } from './product-grpc.interface';

@Injectable()
export class ProductGrpcAdapter implements ProductPort, OnModuleInit {
  private productService: ProductGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.PRODUCT_SERVICE)
    private readonly productClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.productService = this.productClient.getService<ProductGrpcService>('ProductService');
  }

  createProduct(data: CreateProductBodyDto): Promise<void> {
    return firstValueFrom(this.productService.createProduct(data));
  }

  updateProduct(data: UpdateProductBodyDto & { id: string }): Promise<ProductIdResponse> {
    return firstValueFrom(this.productService.updateProduct(data));
  }

  getProductById(data: GetProductByIdBodyDto): Promise<ProductInfoResponse> {
    return firstValueFrom(this.productService.getProductById(data));
  }

  getProductBySlug(data: GetProductBySlugBodyDto): Promise<ProductInfoResponse> {
    return firstValueFrom(this.productService.getProductBySlug(data));
  }

  getProducts(query: GetProductsBodyDto): Promise<GetProductsResponse> {
    return firstValueFrom(this.productService.getProducts(query));
  }

  reserveStock(data: ReserveStockBodyDto): Promise<ReserveStockResponse> {
    return firstValueFrom(this.productService.reserveStock(data));
  }

  getProductCartItem(variantId: string): Promise<ProductCartItemResponse> {
    return firstValueFrom(
      this.productService.getProductCartItem({
        variantId,
      }),
    );
  }
}
