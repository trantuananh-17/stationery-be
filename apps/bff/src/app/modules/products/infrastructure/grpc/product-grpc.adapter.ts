import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ProductPort } from '../../application/ports/product.port';
import {
  CreateReviewBodyDto,
  DeleteReviewBodyDto,
  GetReviewsBodyDto,
  ReviewIdResponse,
  ReviewsResponse,
  AdjustStockBodyDto,
  AdjustStockResponse,
  GetInventoriesBodyDto,
  InventoriesResponse,
  CreateProductBodyDto,
  GetProductByIdBodyDto,
  GetProductBySlugBodyDto,
  GetProductsBodyDto,
  GetProductsByAdminBodyDto,
  GetProductsResponse,
  ProductCartItemResponse,
  ProductIdResponse,
  ProductInfoResponse,
  ProductMutationResponse,
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

  getProductsByAdmin(query: GetProductsByAdminBodyDto): Promise<GetProductsResponse> {
    return firstValueFrom(this.productService.getProductsByAdmin(query));
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

  deleteProduct(data: GetProductByIdBodyDto): Promise<ProductMutationResponse> {
    return firstValueFrom(this.productService.deleteProduct(data));
  }
  getInventories(query: GetInventoriesBodyDto): Promise<InventoriesResponse> {
    return firstValueFrom(this.productService.getInventories(query));
  }

  adjustStock(data: AdjustStockBodyDto): Promise<AdjustStockResponse> {
    return firstValueFrom(this.productService.adjustStock(data));
  }

  getReviews(query: GetReviewsBodyDto): Promise<ReviewsResponse> {
    return firstValueFrom(this.productService.getReviews(query));
  }

  createReview(data: CreateReviewBodyDto): Promise<ReviewIdResponse> {
    return firstValueFrom(this.productService.createReview(data));
  }

  deleteReview(data: DeleteReviewBodyDto): Promise<ProductIdResponse> {
    return firstValueFrom(this.productService.deleteReview(data));
  }

  restoreProduct(data: GetProductByIdBodyDto): Promise<ProductMutationResponse> {
    return firstValueFrom(this.productService.restoreProduct(data));
  }
}
