export class GetReviewsDto {
  productId: string;
  page?: number;
  limit?: number;
}

export class CreateReviewDto {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

export class DeleteReviewDto {
  productId: string;
  userId: string;
}
