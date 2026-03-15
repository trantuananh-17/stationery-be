import { randomUUID } from 'crypto';

export type BrandParams = {
  readonly id: string;
  name: string;
  slug: string;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Brand {
  constructor(private params: BrandParams) {}

  static create(name: string, slug: string): Brand {
    const now = new Date();

    return new Brand({
      id: randomUUID(),
      name,
      slug,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateInfo(data: { name?: string; slug?: string }) {
    if (data.name !== undefined) {
      this.params.name = data.name;
    }

    if (data.slug !== undefined) {
      this.params.slug = data.slug;
    }

    this.touch();
  }

  activate() {
    this.params.isActive = true;
    this.touch();
  }

  deactivate() {
    this.params.isActive = false;
    this.touch();
  }

  private touch() {
    this.params.updatedAt = new Date();
  }

  get id() {
    return this.params.id;
  }
  get name() {
    return this.params.name;
  }
  get slug() {
    return this.params.slug;
  }
  get isActive() {
    return this.params.isActive;
  }
  get createdAt() {
    return this.params.createdAt;
  }
  get updatedAt() {
    return this.params.updatedAt;
  }
}
