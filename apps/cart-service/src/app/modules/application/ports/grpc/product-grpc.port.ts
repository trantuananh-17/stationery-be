import { ProductCartItemRequest, ProductCartItemResponse } from '../contracts/product.contracts';

export abstract class IProductGrpcPort {
  abstract getProductCartItem(data: ProductCartItemRequest): Promise<ProductCartItemResponse>;
}
