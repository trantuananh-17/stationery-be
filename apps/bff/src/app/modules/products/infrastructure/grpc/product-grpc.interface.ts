import { Observable } from 'rxjs';
import {
  CreateProductBodyDto,
  GetProductByIdBodyDto,
  GetProductBySlugBodyDto,
  GetProductsBodyDto,
  GetProductsByAdminBodyDto,
  GetProductsResponse,
  ProductCartItemResponse,
  ProductIdResponse,
  ProductInfoResponse,
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
}
