/**
 * Lỗi đi ra từ một gRPC client: có `code` (mã status) và `details`.
 * Domain error tự ném thì không có hai field này — filter phân biệt bằng `typeof code === 'number'`.
 */
export interface GrpcErrorLike {
  code?: number;
  details?: string;
  message?: string;
}
