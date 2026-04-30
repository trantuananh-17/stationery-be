export interface ProductBodyDto {
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  brandId: string;
  images: string[];
  thumbnail: string;
  featured?: boolean;
  searchKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface SpecificationBodyDto {
  attributeId: string;
  value: string;
}

export interface VariantBodyDto {
  name: string;
  price: number;
  stock: number;
  compareAtPrice?: number;
  image?: string;
  sortOrder?: number;
  isDefault?: boolean;
  attributeValueIds: string[];
  attributeValueSlug: string[];
}

export interface CreateProductBodyDto {
  product: ProductBodyDto;
  specifications: SpecificationBodyDto[];
  variants: VariantBodyDto[];
}

export interface UpdateProductBodyDto {
  product?: Partial<ProductBodyDto>;
  specifications?: Array<Partial<SpecificationBodyDto> & { id?: string }>;
  variants?: Array<Partial<VariantBodyDto> & { id?: string }>;
}

export interface GetProductByIdBodyDto {
  id: string;
}

export interface GetProductBySlugBodyDto {
  slug: string;
}

export interface GetProductsBodyDto {
  search?: string;
  category?: string;
  brand?: string;
  orderBy?: string;
  page?: number;
  limit?: number;
}

export interface ReserveStockItemBodyDto {
  variantId: string;
  quantity: number;
}

export interface ReserveStockBodyDto {
  items: ReserveStockItemBodyDto[];
}

/* ================= CART RESPONSE ================= */

export interface ProductAttributeResponse {
  name: string;
  value: string;
}

export interface ProductCartItemResponse {
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
}

/* ================= STOCK RESPONSE ================= */

export interface ReserveStockItemResponse {
  variantId: string;
  quantity: number;
  success: boolean;
  status: string;
  availableStock: number;
  message?: string;
}

export interface ReserveStockResponse {
  success: boolean;
  items: ReserveStockItemResponse[];
}

/* ================= PRODUCT INFO RESPONSE ================= */

export interface ProductCategoryParentResponse {
  id: string;
  name: string;
  slug: string;
}

export interface ProductCategoryResponse {
  id: string;
  name: string;
  slug: string;
  parent?: ProductCategoryParentResponse;
}

export interface ProductBrandResponse {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariantAttributeResponse {
  attributeId: string;
  attributeName: string;
  attributeValueId: string;
  attributeValue: string;
  attributeValueSlug: string;
}

export interface ProductVariantResponse {
  id: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  reservedStock: number;
  image?: string;
  sortOrder: number;
  isDefault: boolean;
  isAvailable: boolean;
  attributes: ProductVariantAttributeResponse[];
}

export interface ProductVariantOptionValueResponse {
  id: string;
  value: string;
}

export interface ProductVariantOptionResponse {
  attributeId: string;
  attributeName: string;
  values: ProductVariantOptionValueResponse[];
}

export interface ProductSpecificationResponse {
  id: string;
  attributeId: string;
  attributeName: string;
  value: string;
}

export interface ProductInfoResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  images: string[];

  category: ProductCategoryResponse;
  brand: ProductBrandResponse;

  description: string;
  shortDescription: string;
  status: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  baseName?: string;

  variants: ProductVariantResponse[];
  variantOptions: ProductVariantOptionResponse[];
  specifications: ProductSpecificationResponse[];
}

/* ================= PRODUCT LIST RESPONSE ================= */

export interface ProductItemResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
}

export interface GetProductsResponse {
  items: ProductItemResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ================= COMMON RESPONSE ================= */

export interface ProductIdResponse {
  id: string;
}
