import { randomUUID } from 'crypto';
import { Variant } from './variant.entity';
import { Specification } from './specification.entity';
import { ProductStatus } from '../enum/product-status.enum';

export type ProductParams = {
  readonly id: string;
  name: string;
  slug: string;
  readonly categoryId: string;
  readonly brandId: string;
  description: string;
  shortDescription: string;
  images: string[];
  thumbnail?: string;
  status: ProductStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  searchKeywords: string[];
  baseName?: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Product {
  private variants: Variant[] = [];
  private specifications: Specification[] = [];

  constructor(private params: ProductParams) {}

  static create(data: {
    name: string;
    slug: string;
    categoryId: string;
    brandId: string;
    description?: string;
    shortDescription?: string;
    thumbnail?: string;
    images?: string[];
    seoTitle?: string;
    seoDescription?: string;
    searchKeywords?: string[];
    featured?: boolean;
  }): Product {
    const now = new Date();

    return new Product({
      id: randomUUID(),
      name: data.name.trim(),
      slug: data.slug.trim(),
      categoryId: data.categoryId,
      brandId: data.brandId,
      description: data.description?.trim() ?? '',
      shortDescription: data.shortDescription?.trim() ?? '',
      thumbnail: data.thumbnail,
      images: data.images ?? [],
      seoTitle: data.seoTitle?.trim(),
      seoDescription: data.seoDescription?.trim(),
      searchKeywords: data.searchKeywords ?? [],
      featured: data.featured ?? false,
      status: ProductStatus.INACTIVE,
      createdAt: now,
      updatedAt: now,
    });
  }

  addSpecification(data: { attributeId: string; value: string }) {
    const spec = Specification.create({
      productId: this.id,
      ...data,
    });

    this.specifications.push(spec);
    this.setUpdatedAt();
  }

  getSpecifications() {
    return [...this.specifications];
  }

  loadSpecification(spec: Specification) {
    this.specifications.push(spec);
  }

  addVariant(data: {
    name: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    images?: string;
    isDefault?: boolean;
    attributeValueIds?: string[];
  }) {
    const variant = Variant.create({
      productId: this.id,
      ...data,
    });

    data.attributeValueIds?.forEach((attrId) => {
      variant.addAttribute(attrId);
    });

    this.variants.push(variant);
    this.setUpdatedAt();
  }

  getVariants() {
    return [...this.variants];
  }

  loadVariant(variant: Variant) {
    this.variants.push(variant);
  }

  updateInfo(data: { name?: string; description?: string; shortDescription?: string }) {
    if (data.name !== undefined) this.params.name = data.name.trim();
    if (data.description !== undefined) this.params.description = data.description.trim();
    if (data.shortDescription !== undefined) {
      this.params.shortDescription = data.shortDescription.trim();
    }

    this.setUpdatedAt();
  }

  setSlug(slug: string) {
    this.params.slug = slug.trim();
    this.setUpdatedAt();
  }

  setImages(images: string[]) {
    this.params.images = images;
    this.setUpdatedAt();
  }

  setThumbnail(thumbnail: string) {
    this.params.thumbnail = thumbnail;
    this.setUpdatedAt();
  }

  setSEO(data: { title?: string; description?: string; keywords?: string[] }) {
    this.params.seoTitle = data.title?.trim();
    this.params.seoDescription = data.description?.trim();

    if (data.keywords !== undefined) {
      this.params.searchKeywords = data.keywords;
    }

    this.setUpdatedAt();
  }

  setSearchKeywords(keywords: string[]) {
    this.params.searchKeywords = keywords;
    this.setUpdatedAt();
  }

  setFeatured(featured: boolean) {
    this.params.featured = featured;
    this.setUpdatedAt();
  }

  activate() {
    this.params.status = ProductStatus.ACTIVE;
    this.setUpdatedAt();
  }

  deactivate() {
    this.params.status = ProductStatus.INACTIVE;
    this.setUpdatedAt();
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  get id(): string {
    return this.params.id;
  }

  get name(): string {
    return this.params.name;
  }

  get slug(): string {
    return this.params.slug;
  }

  get categoryId(): string {
    return this.params.categoryId;
  }

  get brandId(): string {
    return this.params.brandId;
  }

  get description(): string {
    return this.params.description;
  }

  get shortDescription(): string {
    return this.params.shortDescription;
  }

  get images(): string[] {
    return this.params.images;
  }

  get thumbnail(): string | undefined {
    return this.params.thumbnail;
  }

  get status(): ProductStatus {
    return this.params.status;
  }

  get featured(): boolean {
    return this.params.featured;
  }

  get seoTitle(): string | undefined {
    return this.params.seoTitle;
  }

  get seoDescription(): string | undefined {
    return this.params.seoDescription;
  }

  get searchKeywords(): string[] {
    return this.params.searchKeywords;
  }

  get baseName(): string | undefined {
    return this.params.baseName;
  }

  get isVariantProduct(): boolean {
    return this.variants.filter((v) => !v.deletedAt).length >= 2;
  }
  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
