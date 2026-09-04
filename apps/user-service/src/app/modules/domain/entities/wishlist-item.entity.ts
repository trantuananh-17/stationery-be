export type WishlistItemParams = {
  readonly id: string;
  readonly userId: string;
  readonly productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
  readonly createdAt: Date;
};

export type WishlistItemInput = {
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
};

export class WishlistItem {
  constructor(private params: WishlistItemParams) {}

  static create(userId: string, input: WishlistItemInput) {
    return new WishlistItem({
      id: crypto.randomUUID(),
      userId,
      ...input,
      createdAt: new Date(),
    });
  }

  static restore(params: WishlistItemParams) {
    return new WishlistItem(params);
  }

  get id(): string {
    return this.params.id;
  }

  get userId(): string {
    return this.params.userId;
  }

  get productId(): string {
    return this.params.productId;
  }

  get productName(): string {
    return this.params.productName;
  }

  get productSlug(): string {
    return this.params.productSlug;
  }

  get thumbnail(): string {
    return this.params.thumbnail;
  }

  get price(): number {
    return this.params.price;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }
}
