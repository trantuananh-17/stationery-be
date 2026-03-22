export interface ProductItemReadModel {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  productThumbnail: string;
  imageVariant: string;
  price: number;
  compareAtPrice: number;
  attributes: {
    name: string;
    value: string;
  }[];
}
