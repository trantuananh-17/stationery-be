type SectionRule = {
  id: string;
  title: string;
  keywords: string[];
  phrases: Array<[string, number]>;
  negative?: Array<[string, number]>;
  hints: string[];
};

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

function hasPhrase(normalizedText: string, phrase: string): boolean {
  const text = ` ${normalizedText} `;
  const keyword = ` ${normalizeText(phrase)} `;
  return text.includes(keyword);
}

/**
 * Các section này nên map ĐÚNG với content trong vector DB.
 * Đừng đưa section không tồn tại trong DB vào rewrite query.
 */
const SECTION_RULES: SectionRule[] = [
  {
    id: 'return_policy',
    title: 'CHÍNH SÁCH ĐỔI TRẢ SẢN PHẨM MINACO',
    keywords: ['chính sách đổi trả', 'đổi hàng', 'trả hàng', 'hoàn tiền', 'sản phẩm lỗi'],
    phrases: [
      ['chính sách đổi trả', 12],
      ['đổi trả', 12],
      ['đổi hàng', 10],
      ['trả hàng', 10],
      ['hoàn tiền', 10],
      ['sản phẩm lỗi', 10],
      ['lỗi sản phẩm', 10],
      ['hàng lỗi', 8],
      ['đổi mới', 6],
      ['trả lại hàng', 6],
      ['sản phẩm nguyên vẹn', 5],
      ['còn hóa đơn', 5],
      ['48h', 5],
      ['48 giờ', 5],
    ],
    negative: [
      ['trả tiền', 8],
      ['thanh toán', 4],
      ['cod', 4],
      ['công nợ', 4],
    ],
    hints: [
      'Trường hợp lỗi sản phẩm được đổi mới hoặc hoàn tiền',
      'Yêu cầu còn hóa đơn, sản phẩm nguyên vẹn',
      'Đổi trả do nhu cầu áp dụng trong vòng 48h',
      'Miễn phí nếu Minaco giao hàng',
      'Tính phí nếu dùng bên vận chuyển thứ 3',
    ],
  },

  {
    id: 'payment',
    title: 'PHƯƠNG THỨC THANH TOÁN MINACO',
    keywords: ['phương thức thanh toán', 'chuyển khoản', 'cod', 'thanh toán khi nhận hàng'],
    phrases: [
      ['phương thức thanh toán', 12],
      ['thanh toán', 10],
      ['chuyển khoản', 10],
      ['cod', 10],
      ['thanh toán khi nhận hàng', 12],
      ['trả tiền', 8],
      ['công nợ', 8],
      ['ngân hàng', 6],
      ['tiền mặt', 6],
    ],
    negative: [
      ['trả hàng', 8],
      ['đổi trả', 8],
      ['hoàn tiền', 5],
    ],
    hints: [
      'Khách hàng có thể thanh toán bằng chuyển khoản ngân hàng',
      'Có thể thanh toán COD hoặc thanh toán khi nhận hàng nếu chính sách có nêu',
    ],
  },

  {
    id: 'order_guide',
    title: 'HƯỚNG DẪN ĐẶT HÀNG TRÊN WEBSITE MINACO',
    keywords: ['hướng dẫn đặt hàng', 'cách mua hàng', 'các bước đặt hàng', 'thêm vào giỏ hàng'],
    phrases: [
      ['hướng dẫn đặt hàng', 12],
      ['đặt hàng', 10],
      ['mua hàng', 10],
      ['cách mua', 9],
      ['mua như nào', 9],
      ['mua thế nào', 9],
      ['order', 8],
      ['thêm vào giỏ hàng', 12],
      ['giỏ hàng', 8],
      ['xác nhận đơn hàng', 8],
      ['website', 5],
    ],
    hints: [
      'Tìm kiếm sản phẩm cần mua trên website',
      'Xem giá và thông tin chi tiết sản phẩm',
      'Thêm vào giỏ hàng',
      'Tiến hành thanh toán',
      'Điền thông tin đặt hàng',
      'Xác nhận đơn hàng',
    ],
  },

  {
    id: 'order_support',
    title: 'HỖ TRỢ KHÁCH HÀNG KHI ĐẶT HÀNG',
    keywords: ['hỗ trợ đặt hàng', 'tư vấn mua hàng', 'hỗ trợ khách hàng'],
    phrases: [
      ['hỗ trợ đặt hàng', 12],
      ['tư vấn mua hàng', 12],
      ['hỗ trợ khách hàng', 10],
      ['cần tư vấn', 8],
      ['nhân viên hỗ trợ', 8],
      ['hỗ trợ mua hàng', 10],
      ['khó đặt hàng', 7],
      ['không biết đặt hàng', 7],
    ],
    hints: [
      'Khách hàng có thể liên hệ hotline của Minaco',
      'Có thể sử dụng các kênh liên hệ trên website',
      'Nhân viên hỗ trợ lựa chọn sản phẩm và hướng dẫn đặt hàng',
    ],
  },

  {
    id: 'check_goods',
    title: 'CHÍNH SÁCH KIỂM TRA HÀNG KHI NHẬN',
    keywords: ['kiểm tra hàng khi nhận', 'đồng kiểm hàng hóa', 'từ chối nhận hàng'],
    phrases: [
      ['kiểm tra hàng khi nhận', 12],
      ['kiểm tra hàng', 10],
      ['đồng kiểm', 10],
      ['đồng kiểm hàng hóa', 12],
      ['từ chối nhận hàng', 12],
      ['hàng không đúng', 10],
      ['không đúng cam kết', 10],
      ['nhận một phần đơn hàng', 8],
      ['chất lượng hàng khi nhận', 8],
      ['số lượng hàng khi nhận', 8],
      ['nhận hàng', 4],
    ],
    negative: [
      ['thanh toán khi nhận hàng', 8],
      ['cod', 6],
      ['đổi trả', 5],
      ['hoàn tiền', 5],
    ],
    hints: [
      'Khách hàng được kiểm tra số lượng và chất lượng hàng khi nhận',
      'Nếu có vấn đề có thể nhận một phần đơn hàng',
      'Hoặc từ chối toàn bộ đơn hàng',
      'Không mất phí nếu hàng không đúng cam kết',
    ],
  },

  {
    id: 'contact',
    title: 'THÔNG TIN LIÊN HỆ MINACO',
    keywords: [
      'thông tin liên hệ',
      'hotline minaco',
      'email minaco',
      'địa chỉ minaco',
      'chi nhánh minaco',
    ],
    phrases: [
      ['thông tin liên hệ', 12],
      ['liên hệ', 10],
      ['hotline', 10],
      ['email', 10],
      ['số điện thoại', 10],
      ['sdt', 8],
      ['địa chỉ', 10],
      ['chi nhánh', 10],
      ['trụ sở', 8],
      ['cskh', 8],
    ],
    hints: ['Trụ sở chính', 'Chi nhánh', 'Hotline', 'Email', 'Kênh liên hệ Minaco'],
  },

  {
    id: 'working_time',
    title: 'THỜI GIAN LÀM VIỆC CỦA MINACO',
    keywords: ['thời gian làm việc', 'giờ làm việc', 'ngày lễ', 'lịch hoạt động'],
    phrases: [
      ['thời gian làm việc', 12],
      ['giờ làm việc', 12],
      ['giờ mở cửa', 10],
      ['mở cửa', 8],
      ['đóng cửa', 8],
      ['làm việc mấy giờ', 10],
      ['mấy giờ làm việc', 10],
      ['ngày lễ', 8],
      ['lịch hoạt động', 10],
      ['cuối tuần', 6],
      ['thứ 7', 6],
      ['chủ nhật', 6],
    ],
    hints: [
      'Minaco hoạt động tất cả các ngày trong tuần',
      'Bao gồm cả ngày lễ nếu section có nêu',
      'Khách hàng có thể liên hệ trong thời gian làm việc',
    ],
  },

  {
    id: 'intro',
    title: 'GIỚI THIỆU CỬA HÀNG MINACO',
    keywords: ['giới thiệu minaco', 'cửa hàng minaco', 'văn phòng phẩm minaco'],
    phrases: [
      ['giới thiệu minaco', 12],
      ['minaco là gì', 12],
      ['cửa hàng minaco', 10],
      ['văn phòng phẩm minaco', 10],
      ['minaco bán gì', 9],
      ['về minaco', 8],
      ['kinh nghiệm', 5],
      ['đơn vị cung ứng', 6],
    ],
    hints: [
      'Văn phòng phẩm Minaco',
      'Đơn vị có kinh nghiệm trong lĩnh vực cung ứng vật tư văn phòng',
      'Thông tin giới thiệu cửa hàng Minaco',
    ],
  },

  {
    id: 'privacy',
    title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG',
    keywords: ['chính sách bảo mật', 'thông tin cá nhân', 'dữ liệu khách hàng'],
    phrases: [
      ['chính sách bảo mật', 12],
      ['bảo mật', 10],
      ['thông tin cá nhân', 10],
      ['dữ liệu khách hàng', 10],
      ['dữ liệu', 6],
      ['thu thập thông tin', 10],
      ['bảo mật thông tin', 10],
      ['xác minh danh tính', 6],
    ],
    hints: [
      'Minaco thu thập thông tin khách hàng để xác minh danh tính',
      'Hỗ trợ mua hàng',
      'Bảo mật thông tin khách hàng',
    ],
  },
];

export function classifyQuery(question: string) {
  const originalQuestion = question?.trim() || '';

  if (!originalQuestion) {
    return [];
  }

  const q = normalizeText(originalQuestion);

  return SECTION_RULES.map((rule) => {
    let score = 0;
    const matched: string[] = [];

    for (const [phrase, weight] of rule.phrases) {
      if (hasPhrase(q, phrase)) {
        score += weight;
        matched.push(phrase);
      }
    }

    for (const keyword of rule.keywords) {
      if (hasPhrase(q, keyword)) {
        score += 3;
        matched.push(keyword);
      }
    }

    if (rule.negative) {
      for (const [phrase, weight] of rule.negative) {
        if (hasPhrase(q, phrase)) {
          score -= weight;
        }
      }
    }

    return {
      id: rule.id,
      title: rule.title,
      score: Math.max(score, 0),
      matched: Array.from(new Set(matched)),
      rule,
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function rewriteQuery(question: string): string {
  const originalQuestion = question?.trim() || '';

  if (!originalQuestion) {
    return originalQuestion;
  }

  const scoredSections = classifyQuery(originalQuestion);

  if (scoredSections.length === 0) {
    return originalQuestion;
  }

  const bestScore = scoredSections[0].score;

  /**
   * Lấy section tốt nhất.
   * Chỉ lấy thêm section thứ 2 nếu điểm đủ gần,
   * tránh query bị loãng.
   */
  const selectedSections = scoredSections
    .filter((item) => item.score >= Math.max(5, bestScore * 0.55))
    .slice(0, 2);

  const expandedContext = selectedSections
    .map((item) => {
      const rule = item.rule;

      return `
SECTION: ${rule.title}
KEYWORDS: ${rule.keywords.join(', ')}
NỘI DUNG LIÊN QUAN:
${rule.hints.map((hint) => `- ${hint}`).join('\n')}
MATCHED_TERMS: ${item.matched.join(', ')}
SCORE: ${item.score}
`;
    })
    .join('\n');

  return `
CÂU HỎI GỐC:
${originalQuestion}

TRUY VẤN TÌM KIẾM ƯU TIÊN THEO VECTOR DB:
${expandedContext}
`;
}
