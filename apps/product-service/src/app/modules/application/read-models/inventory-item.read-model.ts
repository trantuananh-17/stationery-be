export interface InventoryItemReadModel {
  variantId: string;
  variantName: string;
  sku: string;
  productId: string;
  productName: string;
  thumbnail: string;
  stock: number;
  reservedStock: number;
  isAvailable: boolean;
}
