import { Injectable } from '@nestjs/common';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AdvisorProduct, ProductAiSortBy } from '../dto/product-ai.dto';
import { AiLlmService } from './ai-llm.service';
import { ProductAiGrpcClientService } from './product-ai.service';

type ProductSearchFilter = {
  keyword: string;
  audience: string;
  need: string;
  category: string;
  brand: string;
  budgetMin: number;
  budgetMax: number;
  sortBy: ProductAiSortBy;
  limit: number;
};

type PromptProduct = {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  categoryName: string;
  brandName: string;
  variantName: string;
  price: number;
  compareAtPrice: number;
  stock: number;
};

type ProductSelectedItem = {
  id: string;
  variantId: string;
  sku: string;
  score: number;
  reason: string;
};

type ProductAdvisorAiResult = {
  response: string;
  intent: 'product';
  selectedItems: ProductSelectedItem[];
};

type ProductAdvisorItem = AdvisorProduct & {
  aiReason: string;
  aiScore: number;
};

type ProductAdvisorResponseItem = {
  productName: string;
  variantName: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  variantImage: string;
  productUrl: string;
  aiReason: string;
  aiScore: number;
};

@Injectable()
export class ProductAdvisorToolService {
  constructor(
    private readonly aiLlmService: AiLlmService,
    private readonly productAiGrpcClientService: ProductAiGrpcClientService,
  ) {}

  async advise(question: string) {
    const filter = await this.parseProductFilter(question);

    console.log('PRODUCT FILTER:', filter);

    const products = await this.productAiGrpcClientService.searchProductsForAdvisor({
      keyword: filter.keyword,
      audience: filter.audience,
      need: filter.need,
      category: filter.category,
      brand: filter.brand,
      budgetMin: filter.budgetMin,
      budgetMax: filter.budgetMax,
      sortBy: filter.sortBy,
      limit: filter.limit,
    });

    console.log('GRPC PRODUCTS LENGTH:', products.length);
    console.log('FIRST PRODUCT RAW:', JSON.stringify(products[0] || null, null, 2));

    if (!products.length) {
      return {
        success: true,
        tool: 'get_product_advisor',
        intent: 'product',
        response:
          'Mình chưa tìm thấy sản phẩm phù hợp với yêu cầu này. Bạn có thể mô tả rộng hơn hoặc tăng ngân sách một chút nhé.',
        filter,
        total: 0,
        candidateCount: 0,
        items: [],
      };
    }

    const promptProducts = products.map((product) => this.toPromptProduct(product));

    console.log('PRODUCTS_SENT_TO_AI_PROMPT:', JSON.stringify(promptProducts, null, 2));

    const aiResult = await this.selectBestProductsByAi(question, filter, promptProducts);

    const selectedProducts = this.mapAiSelectionToProducts(
      products,
      aiResult.selectedItems || [],
      filter,
    );

    const items = selectedProducts.map((product) => this.toProductAdvisorResponseItem(product));

    console.log('FINAL_PRODUCT_ITEMS:', JSON.stringify(items, null, 2));

    return {
      success: true,
      tool: 'get_product_advisor',
      intent: 'product',
      response: aiResult.response,
      filter,
      total: items.length,
      candidateCount: products.length,
      items,
    };
  }

  private async parseProductFilter(question: string): Promise<ProductSearchFilter> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
Bạn là bộ chuyển câu tìm kiếm sản phẩm tiếng Việt thành JSON filter.

QUY TẮC:
- keyword: sản phẩm chính người dùng muốn tìm.
- Nếu người dùng hỏi "bút đỏ", keyword là "bút đỏ".
- Nếu người dùng hỏi "giấy A4", keyword là "giấy A4".
- audience: đối tượng sử dụng. Ví dụ: học sinh, văn phòng, giáo viên.
- need: nhu cầu sử dụng. Ví dụ: viết bài hằng ngày, in tài liệu, lưu hồ sơ.
- category: nếu không có thì "".
- brand: nếu không có thì "".
- budgetMin: nếu không có thì 0.
- budgetMax:
  - "dưới 100k" => 100000
  - "tầm 50k" => 50000
  - "giá rẻ" => 100000
  - không có ngân sách => 0
- sortBy:
  - rẻ nhất, giá rẻ, thấp đến cao => "price_asc"
  - đắt nhất, cao đến thấp => "price_desc"
  - còn lại => "relevant"
- limit mặc định 8.

Chỉ trả JSON đúng dạng:
{{
  "keyword": "",
  "audience": "",
  "need": "",
  "category": "",
  "brand": "",
  "budgetMin": 0,
  "budgetMax": 0,
  "sortBy": "relevant|price_asc|price_desc",
  "limit": 8
}}
        `,
      ],
      [
        'human',
        `
Câu hỏi:
{question}
        `,
      ],
    ]);

    const chain = prompt.pipe(this.aiLlmService.client).pipe(new JsonOutputParser());

    const result = (await chain.invoke({
      question,
    })) as Partial<ProductSearchFilter>;

    return {
      keyword: result.keyword || '',
      audience: result.audience || '',
      need: result.need || '',
      category: result.category || '',
      brand: result.brand || '',
      budgetMin: Number(result.budgetMin || 0),
      budgetMax: Number(result.budgetMax || 0),
      sortBy: result.sortBy || 'relevant',
      limit: this.normalizeLimit(result.limit),
    };
  }

  private async selectBestProductsByAi(
    question: string,
    filter: ProductSearchFilter,
    products: PromptProduct[],
  ): Promise<ProductAdvisorAiResult> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
Bạn là trợ lý tư vấn sản phẩm văn phòng phẩm Minaco.

NHIỆM VỤ:
- Chỉ chọn sản phẩm có trong danh sách products.
- Không được bịa sản phẩm ngoài danh sách.
- Ưu tiên sản phẩm khớp keyword, audience, need và ngân sách.
- Nếu budgetMax > 0 thì không chọn sản phẩm có price > budgetMax.
- Nếu stock <= 0 thì không chọn.
- Sắp xếp sản phẩm phù hợp nhất lên đầu.
- Chọn tối đa ${filter.limit} sản phẩm.
- response chỉ là 1 câu tiếng Việt rất ngắn gọn.
- Không liệt kê mô tả, URL, ảnh, tồn kho trong response text.
- reason là lý do chọn từng sản phẩm, ngắn gọn.

Chỉ trả JSON đúng dạng:
{{
  "response": "Câu trả lời tư vấn ngắn gọn",
  "intent": "product",
  "selectedItems": [
    {{
      "id": "product id",
      "variantId": "variant id",
      "sku": "sku",
      "score": 0.95,
      "reason": "Lý do chọn ngắn gọn"
    }}
  ]
}}
        `,
      ],
      [
        'human',
        `
Câu hỏi người dùng:
{question}

Filter đã parse:
{filter}

Danh sách sản phẩm:
{products}
        `,
      ],
    ]);

    const filterJson = JSON.stringify(filter, null, 2);
    const productsJson = JSON.stringify(products, null, 2);

    const formattedPrompt = await prompt.format({
      question,
      filter: filterJson,
      products: productsJson,
    });

    console.log('PRODUCT_ADVISOR_AI_PROMPT:\n', formattedPrompt);

    const chain = prompt.pipe(this.aiLlmService.client).pipe(new JsonOutputParser());

    const result = (await chain.invoke({
      question,
      filter: filterJson,
      products: productsJson,
    })) as ProductAdvisorAiResult;

    console.log('PRODUCT_ADVISOR_AI_RAW_RESULT:', JSON.stringify(result, null, 2));

    return {
      response: result.response || 'Mình tìm thấy sản phẩm phù hợp với nhu cầu của bạn.',
      intent: 'product',
      selectedItems: Array.isArray(result.selectedItems) ? result.selectedItems : [],
    };
  }

  private toPromptProduct(product: AdvisorProduct): PromptProduct {
    const p = product as any;

    return {
      id: p.id || p.productId || p.product_id || '',
      variantId: p.variantId || p.variant_id || '',
      sku: p.sku || '',
      productName: p.productName || p.name || p.product_name || p.baseName || p.base_name || '',
      categoryName: p.categoryName || p.category_name || '',
      brandName: p.brandName || p.brand_name || '',
      variantName: p.variantName || p.variant_name || '',
      price: Number(p.price || 0),
      compareAtPrice: Number(p.compareAtPrice || p.compare_at_price || 0),
      stock: Number(p.stock || 0),
    };
  }

  private mapAiSelectionToProducts(
    products: AdvisorProduct[],
    selectedItems: ProductSelectedItem[],
    filter: ProductSearchFilter,
  ): ProductAdvisorItem[] {
    const productMap = new Map<string, AdvisorProduct>();

    for (const product of products) {
      const p = product as any;

      const keys = [p.variantId, p.variant_id, p.sku, p.id, p.productId, p.product_id].filter(
        Boolean,
      );

      for (const key of keys) {
        productMap.set(String(key), product);
      }
    }

    const mapped: ProductAdvisorItem[] = [];

    for (const selected of selectedItems) {
      const product =
        productMap.get(String(selected.variantId || '')) ||
        productMap.get(String(selected.sku || '')) ||
        productMap.get(String(selected.id || ''));

      if (!product) {
        continue;
      }

      mapped.push({
        ...(product as any),
        aiReason: selected.reason || 'Phù hợp với yêu cầu tìm kiếm.',
        aiScore: Number(selected.score || 0.5),
      });
    }

    if (mapped.length > 0) {
      return mapped.slice(0, filter.limit);
    }

    return products.slice(0, filter.limit).map((product) => ({
      ...(product as any),
      aiReason: 'Sản phẩm phù hợp nhất trong danh sách tìm được.',
      aiScore: 0.5,
    }));
  }

  private toProductAdvisorResponseItem(product: ProductAdvisorItem): ProductAdvisorResponseItem {
    const p = product as any;

    const productName =
      p.productName || p.name || p.product_name || p.baseName || p.base_name || '';

    const variantName = p.variantName || p.variant_name || '';

    const price = Number(p.price || p.variantPrice || p.variant_price || 0);

    const compareAtPrice = Number(
      p.compareAtPrice ||
        p.compare_at_price ||
        p.variantCompareAtPrice ||
        p.variant_compare_at_price ||
        0,
    );

    const stock = Number(p.stock || p.variantStock || p.variant_stock || 0);

    const variantImage =
      p.variantImage ||
      p.variant_image ||
      p.image ||
      p.thumbnail ||
      p.productThumbnail ||
      p.product_thumbnail ||
      '';

    const slug = p.slug || p.productSlug || p.product_slug || '';

    const productUrl = p.productUrl || p.product_url || (slug ? `/products/${slug}` : '');

    return {
      productName,
      variantName,
      price,
      compareAtPrice,
      stock,
      variantImage,
      productUrl,
      aiReason: p.aiReason || 'Phù hợp với yêu cầu tìm kiếm.',
      aiScore: Number(p.aiScore || 0.5),
    };
  }

  private normalizeLimit(limit?: number): number {
    const value = Number(limit || 8);

    if (!Number.isFinite(value)) {
      return 8;
    }

    return Math.min(Math.max(value, 1), 12);
  }
}
