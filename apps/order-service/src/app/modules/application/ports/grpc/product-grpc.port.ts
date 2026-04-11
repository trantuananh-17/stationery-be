import { ReserveStockItemRequest, ReserveStockResponse } from '../contracts/product.contract';

export abstract class IProductGrpcPort {
  abstract reserveStock(data: ReserveStockItemRequest[]): Promise<ReserveStockResponse>;
}
