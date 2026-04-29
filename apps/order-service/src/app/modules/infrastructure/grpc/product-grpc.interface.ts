import { Observable } from 'rxjs';
import { ReserveStockResponse } from '../../application/ports/contracts/product.contract';

export interface IProductGrpcService {
  reserveStock(data: {
    items: {
      variantId: string;
      quantity: number;
    }[];
  }): Observable<ReserveStockResponse>;
}
