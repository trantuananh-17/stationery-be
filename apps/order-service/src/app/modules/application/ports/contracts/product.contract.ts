export type ReserveStockItemResponse = {
  variantId: string;
  quantity: number;
  success: boolean;
  status: string;
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
