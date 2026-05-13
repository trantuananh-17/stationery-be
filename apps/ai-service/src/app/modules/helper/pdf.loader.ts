import { Document } from '@langchain/core/documents';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as fs from 'fs';

type PdfSection = {
  title: string;
  content: string;
};

const HEADING_MAP = [
  {
    title: 'GIỚI THIỆU CỬA HÀNG MINACO',
    type: 'intro',
    keywords: ['giới thiệu minaco', 'cửa hàng minaco', 'văn phòng phẩm minaco'],
  },
  {
    title: 'THỜI GIAN LÀM VIỆC CỦA MINACO',
    type: 'working_time',
    keywords: ['thời gian làm việc', 'giờ làm việc', 'ngày lễ', 'lịch hoạt động'],
  },
  {
    title: 'THÔNG TIN LIÊN HỆ MINACO',
    type: 'contact',
    keywords: [
      'thông tin liên hệ',
      'hotline minaco',
      'email minaco',
      'địa chỉ minaco',
      'chi nhánh minaco',
    ],
  },
  {
    title: 'HƯỚNG DẪN ĐẶT HÀNG TRÊN WEBSITE MINACO',
    type: 'order_guide',
    keywords: ['hướng dẫn đặt hàng', 'cách mua hàng', 'các bước đặt hàng', 'thêm vào giỏ hàng'],
  },
  {
    title: 'HỖ TRỢ KHÁCH HÀNG KHI ĐẶT HÀNG',
    type: 'order_support',
    keywords: ['hỗ trợ đặt hàng', 'tư vấn mua hàng', 'hỗ trợ khách hàng'],
  },
  {
    title: 'CHÍNH SÁCH GIAO HÀNG VÀ VẬN CHUYỂN MINACO',
    type: 'shipping',
    keywords: ['thời gian giao hàng', 'chính sách vận chuyển', 'phí ship', 'giao hàng toàn quốc'],
  },
  {
    title: 'CHÍNH SÁCH KIỂM TRA HÀNG KHI NHẬN',
    type: 'checking',
    keywords: ['kiểm tra hàng khi nhận', 'đồng kiểm hàng hóa', 'từ chối nhận hàng'],
  },
  {
    title: 'CHÍNH SÁCH ĐỔI TRẢ SẢN PHẨM MINACO',
    type: 'return_policy',
    keywords: ['chính sách đổi trả', 'đổi hàng', 'trả hàng', 'hoàn tiền', 'sản phẩm lỗi'],
  },
  {
    title: 'PHƯƠNG THỨC THANH TOÁN MINACO',
    type: 'payment',
    keywords: ['phương thức thanh toán', 'chuyển khoản', 'cod', 'thanh toán khi nhận hàng'],
  },
  {
    title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG',
    type: 'privacy',
    keywords: ['chính sách bảo mật', 'thông tin cá nhân', 'dữ liệu khách hàng'],
  },
];

function normalize(text: string) {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[:–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanText(text: string) {
  return text
    .normalize('NFC')
    .replace(/\r/g, '\n')
    .replace(/^\s*[-+•]\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function findHeading(text: string) {
  const normText = normalize(text);

  return HEADING_MAP.find((heading) => {
    const normHeading = normalize(heading.title);

    return normText === normHeading || normText.startsWith(normHeading);
  });
}

function splitByHeadings(rawText: string): PdfSection[] {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: PdfSection[] = [];

  let currentTitle = '';
  let buffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line1 = lines[i] || '';
    const line2 = lines[i + 1] || '';
    const line3 = lines[i + 2] || '';

    const merged2 = `${line1} ${line2}`.trim();
    const merged3 = `${line1} ${line2} ${line3}`.trim();

    const heading = findHeading(line1) || findHeading(merged2) || findHeading(merged3);

    if (heading) {
      if (currentTitle && buffer.join('\n').trim().length > 10) {
        sections.push({
          title: currentTitle,
          content: buffer.join('\n').trim(),
        });
      }

      currentTitle = heading.title;
      buffer = [];

      if (findHeading(merged3) && !findHeading(line1) && !findHeading(merged2)) {
        i += 2;
      } else if (findHeading(merged2) && !findHeading(line1)) {
        i += 1;
      }

      continue;
    }

    buffer.push(line1);
  }

  if (currentTitle && buffer.join('\n').trim().length > 10) {
    sections.push({
      title: currentTitle,
      content: buffer.join('\n').trim(),
    });
  }

  return sections;
}

function getHeadingConfig(title: string) {
  const normTitle = normalize(title);

  return HEADING_MAP.find((h) => normalize(h.title) === normTitle);
}

function buildPageContent(section: PdfSection) {
  const config = getHeadingConfig(section.title);
  const keywords = config?.keywords ?? [];

  return `
SECTION: ${section.title}

KEYWORDS: ${keywords.join(', ')}

${section.content}
`.trim();
}

export async function loadPdfAsDocuments(filePath: string): Promise<Document[]> {
  console.time('LOAD_PDF_TOTAL');

  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = '';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item: any) => item.str)
      .join('\n')
      .normalize('NFC');

    fullText += `\n${pageText}`;
  }

  const cleaned = cleanText(fullText);

  console.log('PDF TEXT PREVIEW:', cleaned.slice(0, 2000));

  const sections = splitByHeadings(cleaned);

  console.log('TOTAL SECTIONS:', sections.length);

  sections.forEach((section, index) => {
    const config = getHeadingConfig(section.title);

    console.log(`${index + 1}. [${config?.type ?? 'general'}] ${section.title}`);
  });

  const documents = sections.map((section, index) => {
    const config = getHeadingConfig(section.title);
    const keywords = config?.keywords ?? [];

    return new Document({
      pageContent: buildPageContent(section),
      metadata: {
        source: filePath,
        section: section.title,
        sectionType: config?.type ?? 'general',
        chunkIndex: index + 1,
        keywords,
      },
    });
  });

  console.timeEnd('LOAD_PDF_TOTAL');

  return documents;
}
