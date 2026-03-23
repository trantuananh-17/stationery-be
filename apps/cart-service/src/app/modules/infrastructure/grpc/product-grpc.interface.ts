import { Observable } from 'rxjs';
import {
  ProductCartItemRequest,
  ProductCartItemResponse,
} from '../../application/ports/contracts/product.contracts';

export interface IProductGrpcService {
  getProductCartItem(data: ProductCartItemRequest): Observable<ProductCartItemResponse>;
}
