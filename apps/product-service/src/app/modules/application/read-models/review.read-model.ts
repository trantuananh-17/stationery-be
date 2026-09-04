export interface ReviewReadModel {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ReviewSummaryReadModel {
  /** Điểm trung bình đã làm tròn 1 chữ số thập phân. */
  average: number;
  count: number;
}
