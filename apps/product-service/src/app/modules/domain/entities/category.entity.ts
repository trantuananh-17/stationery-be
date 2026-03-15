import { randomUUID } from 'crypto';

export type CategoryParams = {
  readonly id: string;
  name: string;
  slug: string;
  parentId?: string;
  position: number;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Category {
  constructor(private params: CategoryParams) {}

  static create(name: string, slug: string, parentId?: string): Category {
    const now = new Date();

    return new Category({
      id: randomUUID(),
      name,
      slug,
      parentId,
      position: 0,
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

  setPosition(position: number) {
    this.params.position = position;
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

  get parentId() {
    return this.params.parentId;
  }

  get position() {
    return this.params.position;
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
