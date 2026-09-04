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
} from './dtos/product.dto';

export abstract class ProductPort {
  abstract createProduct(data: CreateProductBodyDto): Promise<void>;

  abstract updateProduct(data: UpdateProductBodyDto & { id: string }): Promise<ProductIdResponse>;

  abstract getProductById(data: GetProductByIdBodyDto): Promise<ProductInfoResponse>;

  abstract getProductBySlug(data: GetProductBySlugBodyDto): Promise<ProductInfoResponse>;

  abstract getProducts(query: GetProductsBodyDto): Promise<GetProductsResponse>;

  abstract getProductsByAdmin(query: GetProductsByAdminBodyDto): Promise<GetProductsResponse>;

  abstract reserveStock(data: ReserveStockBodyDto): Promise<ReserveStockResponse>;

  abstract getProductCartItem(variantId: string): Promise<ProductCartItemResponse>;

  abstract deleteProduct(data: GetProductByIdBodyDto): Promise<ProductMutationResponse>;

  abstract restoreProduct(data: GetProductByIdBodyDto): Promise<ProductMutationResponse>;

  abstract getInventories(query: GetInventoriesBodyDto): Promise<InventoriesResponse>;

  abstract adjustStock(data: AdjustStockBodyDto): Promise<AdjustStockResponse>;

  abstract getReviews(query: GetReviewsBodyDto): Promise<ReviewsResponse>;

  abstract createReview(data: CreateReviewBodyDto): Promise<ReviewIdResponse>;

  abstract deleteReview(data: DeleteReviewBodyDto): Promise<ProductIdResponse>;
}
