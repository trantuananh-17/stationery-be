export type ProductAttributeResponse = {
  value: string;
  name: string;
};

export type ProductCartItemRequest = {
  variantId: string;
};

export type ProductCartItemResponse = {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  productThumbnail: string;
  imageVariant?: string;
  price: number;
  compareAtPrice?: number;
  attributes: ProductAttributeResponse[];
  stock: number;
};
