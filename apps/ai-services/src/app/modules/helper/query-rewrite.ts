export function rewriteQuery(question: string): string {
  const q = question.toLowerCase().trim();

  // 1. Thời gian giao/nhận hàng: phải đặt trước "đặt hàng"
  if (
    q.includes('bao lâu') ||
    q.includes('mấy ngày') ||
    q.includes('khi nào nhận') ||
    q.includes('bao giờ nhận') ||
    q.includes('nhận được hàng') ||
    q.includes('thời gian nhận hàng') ||
    q.includes('mất bao lâu') ||
    q.includes('bao lâu nhận')
  ) {
    return `
${question}
thời gian giao hàng
bao lâu nhận được hàng
giao hàng mất bao lâu
vận chuyển 2-5 ngày
giao hỏa tốc trong ngày
chính sách vận chuyển
`;
  }

  // 2. Liên hệ
  if (
    q.includes('liên hệ') ||
    q.includes('hotline') ||
    q.includes('email') ||
    q.includes('số điện thoại') ||
    q.includes('sdt') ||
    q.includes('địa chỉ') ||
    q.includes('chi nhánh') ||
    q.includes('cskh')
  ) {
    return `
${question}
thông tin liên hệ minaco
hotline minaco
số điện thoại minaco
email minaco
địa chỉ minaco
chi nhánh minaco
cskh minaco
`;
  }

  // 3. Đặt hàng / mua hàng
  if (
    q.includes('đặt hàng') ||
    q.includes('mua hàng') ||
    q.includes('order') ||
    q.includes('mua sao') ||
    q.includes('cách mua') ||
    q.includes('mua như nào') ||
    q.includes('mua thế nào')
  ) {
    return `
${question}
hướng dẫn đặt hàng
cách mua hàng trên website
quy trình mua hàng
các bước đặt hàng
thêm vào giỏ hàng
xác nhận đơn hàng
`;
  }

  // 4. Giao hàng / ship / vận chuyển
  if (
    q.includes('ship') ||
    q.includes('giao hàng') ||
    q.includes('vận chuyển') ||
    q.includes('phí giao') ||
    q.includes('phí ship')
  ) {
    return `
${question}
chính sách giao hàng
chính sách vận chuyển
phí ship
miễn phí vận chuyển
thời gian giao hàng
giao hàng toàn quốc
`;
  }

  // 5. Kiểm tra hàng
  if (
    q.includes('nhận hàng') ||
    q.includes('kiểm tra hàng') ||
    q.includes('đồng kiểm') ||
    q.includes('hàng không đúng')
  ) {
    return `
${question}
kiểm tra hàng khi nhận
chính sách nhận hàng
đồng kiểm hàng hóa
từ chối nhận hàng
`;
  }

  // 6. Đổi trả
  if (
    q.includes('đổi') ||
    q.includes('trả') ||
    q.includes('hoàn tiền') ||
    q.includes('sản phẩm lỗi')
  ) {
    return `
${question}
chính sách đổi trả
đổi sản phẩm
trả sản phẩm
hoàn tiền
sản phẩm lỗi
`;
  }

  // 7. Thanh toán
  if (
    q.includes('thanh toán') ||
    q.includes('cod') ||
    q.includes('chuyển khoản') ||
    q.includes('trả tiền') ||
    q.includes('công nợ')
  ) {
    return `
${question}
phương thức thanh toán
thanh toán chuyển khoản
cod
thanh toán khi nhận hàng
thanh toán công nợ
`;
  }

  // 8. Bảo mật
  if (
    q.includes('bảo mật') ||
    q.includes('thông tin cá nhân') ||
    q.includes('dữ liệu') ||
    q.includes('thu thập thông tin')
  ) {
    return `
${question}
chính sách bảo mật
bảo mật thông tin khách hàng
thông tin cá nhân
dữ liệu khách hàng
`;
  }

  return question;
}
