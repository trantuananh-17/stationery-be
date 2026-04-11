export type ReserveStockItemResponse = {
  variantId: string;
  quantity: number;
  success: boolean;
  status: 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive';
  availableStock: number;
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
