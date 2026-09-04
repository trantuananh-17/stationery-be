import { VariantStockSnapshot } from '../../read-models/variant-stock.read-model';

export abstract class IInventoryCommandRepository {
  abstract findVariants(variantIds: string[]): Promise<VariantStockSnapshot[]>;

  abstract findVariant(variantId: string): Promise<VariantStockSnapshot | null>;

  abstract reserveStockAtomic(variantId: string, quantity: number): Promise<boolean>;

  // confirm
  abstract confirmStockAtomic(variantId: string, quantity: number): Promise<boolean>;

  // cancel
  abstract releaseStockAtomic(variantId: string, quantity: number): Promise<boolean>;

  //return
  abstract restockAtomic(variantId: string, quantity: number): Promise<boolean>;

  /** Admin đặt lại tồn kho tuyệt đối; không đụng tới reservedStock. */
  abstract setStock(variantId: string, stock: number): Promise<void>;
}
