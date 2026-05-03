export type ReserveStockItemResponse = {
  variantId: string;
  quantity: number;
  success: boolean;
  status: 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';
  availableStock: number;
  remainingStock: number;
  message?: string;
};
export type ReserveStockResponse = {
  success: boolean;
  items: ReserveStockItemResponse[];
};

export type ReserveStockItemRequest = {
  variantId: string;
  quantity: number;
};
