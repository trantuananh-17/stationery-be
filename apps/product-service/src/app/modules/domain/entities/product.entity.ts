import { randomUUID } from 'crypto';

export type ProductStatus = 'active' | 'inactive' | 'draft';

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
  constructor(private params: ProductParams) {}

  static create(name: string, slug: string, categoryId: string, brandId: string): Product {
    const now = new Date();

    return new Product({
      id: randomUUID(),
      name,
      slug,
      categoryId,
      brandId,
      description: '',
      shortDescription: '',
      images: [],
      status: 'draft',
      featured: false,
      searchKeywords: [],
      baseName: name,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateInfo(data: { name?: string; description?: string; shortDescription?: string }) {
    if (data.name !== undefined) this.params.name = data.name;
    if (data.description !== undefined) this.params.description = data.description;
    if (data.shortDescription !== undefined) this.params.shortDescription = data.shortDescription;

    this.touch();
  }

  setImages(images: string[]) {
    this.params.images = images;
    this.touch();
  }

  setThumbnail(thumbnail: string) {
    this.params.thumbnail = thumbnail;
    this.touch();
  }

  setSEO(data: { title?: string; description?: string; keywords?: string[] }) {
    this.params.seoTitle = data.title;
    this.params.seoDescription = data.description;

    this.touch();
  }

  setSearchKeywords(keywords: string[]) {
    this.params.searchKeywords = keywords;
    this.touch();
  }

  setFeatured(featured: boolean) {
    this.params.featured = featured;
    this.touch();
  }

  activate() {
    this.params.status = 'active';
    this.touch();
  }

  deactivate() {
    this.params.status = 'inactive';
    this.touch();
  }

  private touch() {
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

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
