export class GetInventoriesDto {
  search?: string;
  lowStockThreshold?: number;
  page?: number;
  limit?: number;
}

export class AdjustStockDto {
  variantId: string;
  stock: number;
}
