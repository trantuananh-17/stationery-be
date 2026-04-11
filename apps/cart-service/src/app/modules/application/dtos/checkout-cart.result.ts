export interface CheckoutCartItemResult {
  productId: string;
  variantId: string;
  quantity: number;
  productNameSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot?: string;
  productThumbnailSnapshot?: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  attributesSnapshot: {
    name: string;
    value: string;
  }[];

  subtotal: number;
}

export interface CheckoutCartResult {
  id: string;
  userId: string;
  items: CheckoutCartItemResult[];
  subtotal: number;
  totalItems: number;
}
