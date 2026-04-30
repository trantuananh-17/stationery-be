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
} from './dtos/product.dto';

export abstract class ProductPort {
  abstract createProduct(data: CreateProductBodyDto): Promise<void>;

  abstract updateProduct(data: UpdateProductBodyDto & { id: string }): Promise<ProductIdResponse>;

  abstract getProductById(data: GetProductByIdBodyDto): Promise<ProductInfoResponse>;

  abstract getProductBySlug(data: GetProductBySlugBodyDto): Promise<ProductInfoResponse>;

  abstract getProducts(query: GetProductsBodyDto): Promise<GetProductsResponse>;

  abstract reserveStock(data: ReserveStockBodyDto): Promise<ReserveStockResponse>;

  abstract getProductCartItem(variantId: string): Promise<ProductCartItemResponse>;
}
