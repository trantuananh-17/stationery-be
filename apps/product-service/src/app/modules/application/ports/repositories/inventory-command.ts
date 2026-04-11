import { VariantStockSnapshot } from '../../read-models/variant-stock.read-model';

export abstract class IInventoryCommandRepository {
  abstract findVariantsForUpdate(variantIds: string[]): Promise<VariantStockSnapshot[]>;

  abstract reserveStock(variantId: string, quantity: number): Promise<void>;
}
