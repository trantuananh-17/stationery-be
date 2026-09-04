import { Observable } from 'rxjs';
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

export interface ProductGrpcService {
  createProduct(data: CreateProductBodyDto): Observable<void>;

  updateProduct(data: UpdateProductBodyDto & { id: string }): Observable<ProductIdResponse>;

  getProductById(data: GetProductByIdBodyDto): Observable<ProductInfoResponse>;

  getProductBySlug(data: GetProductBySlugBodyDto): Observable<ProductInfoResponse>;

  getProducts(data: GetProductsBodyDto): Observable<GetProductsResponse>;

  getProductsByAdmin(query: GetProductsByAdminBodyDto): Observable<GetProductsResponse>;

  reserveStock(data: ReserveStockBodyDto): Observable<ReserveStockResponse>;

  getProductCartItem(data: { variantId: string }): Observable<ProductCartItemResponse>;

  deleteProduct(data: GetProductByIdBodyDto): Observable<ProductMutationResponse>;

  restoreProduct(data: GetProductByIdBodyDto): Observable<ProductMutationResponse>;

  getInventories(query: GetInventoriesBodyDto): Observable<InventoriesResponse>;

  adjustStock(data: AdjustStockBodyDto): Observable<AdjustStockResponse>;

  getReviews(query: GetReviewsBodyDto): Observable<ReviewsResponse>;

  createReview(data: CreateReviewBodyDto): Observable<ReviewIdResponse>;

  deleteReview(data: DeleteReviewBodyDto): Observable<ProductIdResponse>;
}
