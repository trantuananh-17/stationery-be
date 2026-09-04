export type ReviewParams = {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  userName: string;
  rating: number;
  comment: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;

export class Review {
  constructor(private params: ReviewParams) {}

  static create(input: {
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }) {
    const now = new Date();

    return new Review({
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(params: ReviewParams) {
    return new Review(params);
  }

  edit(rating: number, comment: string, userName: string) {
    this.params.rating = rating;
    this.params.comment = comment;
    this.params.userName = userName;
    this.params.updatedAt = new Date();
  }

  get id(): string {
    return this.params.id;
  }

  get productId(): string {
    return this.params.productId;
  }

  get userId(): string {
    return this.params.userId;
  }

  get userName(): string {
    return this.params.userName;
  }

  get rating(): number {
    return this.params.rating;
  }

  get comment(): string {
    return this.params.comment;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
