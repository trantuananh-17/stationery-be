export interface VariantStockSnapshot {
  variantId: string;
  productId: string;
  sku: string;
  stock: number;
  reservedStock: number;
  isAvailable: boolean;
  deletedAt?: Date | null;
}
