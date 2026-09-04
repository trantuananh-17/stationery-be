/**
 * Chính sách phí vận chuyển.
 *
 * Phí tính trên giá trị hàng **sau khi trừ giảm giá** — nếu tính trên giá trước giảm,
 * khách có thể dùng mã để hạ đơn xuống dưới ngưỡng mà vẫn được miễn phí ship.
 *
 * Cấu hình qua env để đổi được mà không phải build lại:
 *   SHIPPING_FLAT_FEE       — phí cố định mỗi đơn (mặc định 30000)
 *   SHIPPING_FREE_THRESHOLD — từ mức này trở lên thì miễn phí (mặc định 500000)
 */
export const SHIPPING_FLAT_FEE = Number(process.env.SHIPPING_FLAT_FEE ?? 30000);
export const SHIPPING_FREE_THRESHOLD = Number(process.env.SHIPPING_FREE_THRESHOLD ?? 500000);

export function calculateShippingFee(amountAfterDiscount: number): number {
  if (amountAfterDiscount <= 0) return 0;

  return amountAfterDiscount >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT_FEE;
}
