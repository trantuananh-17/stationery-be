import { randomUUID } from 'crypto';
import { Variant } from './variant.entity';
import { Specification } from './specification.entity';
import { ProductStatus } from '../enum/product-status.enum';

export type ProductParams = {
  readonly id: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId: string;
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

  syncSpecifications(inputs: Array<{ id?: string; attributeId: string; value: string }>) {
    const nextSpecifications: Specification[] = [];

    for (const input of inputs) {
      if (input.id) {
        const existingSpec = this.specifications.find((spec) => spec.id === input.id);

        if (!existingSpec) {
          throw new Error(`Specification with id ${input.id} not found`);
        }

        existingSpec.update({
          attributeId: input.attributeId,
          value: input.value,
        });

        nextSpecifications.push(existingSpec);
        continue;
      }

      const newSpec = Specification.create({
        productId: this.id,
        attributeId: input.attributeId,
        value: input.value,
      });

      nextSpecifications.push(newSpec);
    }

    this.specifications = nextSpecifications;
    this.setUpdatedAt();
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

  syncVariants(
    inputs: Array<{
      id?: string;
      name: string;
      price: number;
      compareAtPrice?: number;
      images?: string;
      sortOrder?: number;
      isDefault?: boolean;
      attributeValueIds: string[];
      sku?: string;
    }>,
  ) {
    const inputIds = new Set(inputs.filter((x) => x.id).map((x) => x.id));

    // variant cũ không còn trong input => soft delete
    for (const variant of this.variants) {
      if (!variant.deletedAt && !inputIds.has(variant.id)) {
        variant.remove();
      }
    }

    // update existing / add new
    for (const input of inputs) {
      if (input.id) {
        const existingVariant = this.variants.find((v) => v.id === input.id);

        if (!existingVariant) {
          throw new Error(`Variant with id ${input.id} not found`);
        }

        existingVariant.restore();
        existingVariant.updateInfo({
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          images: input.images,
          sortOrder: input.sortOrder,
          isDefault: input.isDefault,
        });

        continue;
      }

      const newVariant = Variant.create({
        productId: this.id,
        name: input.name,
        sku: input.sku,
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        images: input.images,
        sortOrder: input.sortOrder,
        isDefault: input.isDefault,
      });

      input.attributeValueIds.forEach((attributeValueId) => {
        newVariant.addAttribute(attributeValueId);
      });

      this.variants.push(newVariant);
    }

    this.ensureSingleDefaultVariant();
    this.setUpdatedAt();
  }

  updateProductInfo(data: {
    name?: string;
    description?: string;
    shortDescription?: string;
    slug?: string;
    images?: string[];
    thumbnail?: string;
    featured?: boolean;
    searchKeywords?: string[];
    seoTitle?: string;
    seoDescription?: string;
  }) {
    if (data.name !== undefined) {
      this.params.name = data.name.trim();
    }

    if (data.description !== undefined) {
      this.params.description = data.description.trim();
    }

    if (data.shortDescription !== undefined) {
      this.params.shortDescription = data.shortDescription.trim();
    }

    if (data.slug !== undefined) {
      this.params.slug = data.slug.trim();
    }

    if (data.images !== undefined) {
      this.params.images = data.images;
    }

    if (data.thumbnail !== undefined) {
      this.params.thumbnail = data.thumbnail;
    }

    if (data.featured !== undefined) {
      this.params.featured = data.featured;
    }

    if (data.seoTitle !== undefined) {
      this.params.seoTitle = data.seoTitle.trim();
    }

    if (data.seoDescription !== undefined) {
      this.params.seoDescription = data.seoDescription.trim();
    }

    if (data.searchKeywords !== undefined) {
      this.params.searchKeywords = data.searchKeywords;
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

  private ensureSingleDefaultVariant() {
    const activeVariants = this.variants.filter((v) => !v.deletedAt);
    const defaultVariants = activeVariants.filter((v) => v.isDefault);

    if (defaultVariants.length <= 1) {
      return;
    }

    let keepFirst = true;

    for (const variant of activeVariants) {
      if (!variant.isDefault) {
        continue;
      }

      if (keepFirst) {
        keepFirst = false;
        continue;
      }

      variant.unsetDefault();
    }
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
