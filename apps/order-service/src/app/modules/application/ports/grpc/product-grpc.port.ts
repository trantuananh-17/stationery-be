import { ReserveStockItemRequest, ReserveStockResponse } from '../contracts/product.contract';

export abstract class IProductGrpcPort {
  abstract reserveStock(data: {
    items: {
      variantId: string;
      quantity: number;
    }[];
  }): Promise<ReserveStockResponse>;
}
