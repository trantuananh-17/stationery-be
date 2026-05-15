import { Injectable } from '@nestjs/common';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AdvisorProduct, ProductAiSortBy } from '../dto/product-ai.dto';
import { AiLlmService } from './ai-llm.service';
import { ProductAiGrpcClientService } from './product-ai.service';
import type { ProductAdvisorFilter, ProductAdvisorIntent } from './tool-router.service';
import { ChatToolResponseDto } from '../dto/chat-tool-response.dto';

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

  async advise(
    question: string,
    advisorIntent: ProductAdvisorIntent = 'general',
    advisorFilter?: ProductAdvisorFilter,
  ): Promise<ChatToolResponseDto> {
    const normalizedIntent = this.normalizeAdvisorIntent(advisorIntent);

    console.log('PRODUCT ADVISOR INTENT:', normalizedIntent);

    const filter = this.normalizeProductSearchFilter(advisorFilter, normalizedIntent, question);

    console.log('PRODUCT FILTER:', filter);

    const candidateLimit = this.getCandidateLimit(normalizedIntent);

    const products = await this.productAiGrpcClientService.searchProductsForAdvisor({
      keyword: filter.keyword,
      audience: filter.audience,
      need: filter.need,
      category: filter.category,
      brand: filter.brand,
      budgetMin: filter.budgetMin,
      budgetMax: filter.budgetMax,
      sortBy: filter.sortBy,

      // Lấy nhiều product từ Product Service để AI có dữ liệu chọn
      limit: candidateLimit,

      advisorIntent: normalizedIntent,
    } as any);

    console.log('GRPC PRODUCTS LENGTH:', products.length);
    console.log('FIRST PRODUCT RAW:', JSON.stringify(products[0] || null, null, 2));

    if (!products.length) {
      return {
        success: true,
        tool: 'get_product_advisor',
        intent: 'product',
        advisorIntent: normalizedIntent,
        response: this.buildNoProductResponse(normalizedIntent),
        filter,
        total: 0,
        candidateCount: 0,
        selectionMode: 'none',
        items: [],
      };
    }

    if (products.length <= filter.limit) {
      const selectedProducts = this.mapProductsWithoutAi(products, filter, normalizedIntent);
      const items = selectedProducts.map((product) => this.toProductAdvisorResponseItem(product));

      console.log('FINAL_PRODUCT_ITEMS_DIRECT:', JSON.stringify(items, null, 2));

      return {
        success: true,
        tool: 'get_product_advisor',
        intent: 'product',
        advisorIntent: normalizedIntent,
        response: this.buildDefaultAiResponse(normalizedIntent),
        filter,
        total: items.length,
        candidateCount: products.length,
        selectionMode: 'direct',
        items,
      };
    }

    const promptProducts = products.map((product) => this.toPromptProduct(product));

    console.log('PRODUCTS_SENT_TO_AI_COUNT:', promptProducts.length);

    const aiResult = await this.selectBestProductsByAi(
      question,
      normalizedIntent,
      filter,
      promptProducts,
    );

    const selectedProducts = this.mapAiSelectionToProducts(
      products,
      aiResult.selectedItems || [],
      filter,
    );

    const items = selectedProducts.map((product) => this.toProductAdvisorResponseItem(product));

    console.log('FINAL_PRODUCT_ITEMS_AI:', JSON.stringify(items, null, 2));

    return {
      success: true,
      tool: 'get_product_advisor',
      intent: 'product',
      advisorIntent: normalizedIntent,
      response: aiResult.response,
      filter,
      total: items.length,
      candidateCount: products.length,
      selectionMode: 'ai',
      items,
    };
  }

  private async selectBestProductsByAi(
    question: string,
    advisorIntent: ProductAdvisorIntent,
    filter: ProductSearchFilter,
    products: PromptProduct[],
  ): Promise<ProductAdvisorAiResult> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
Bạn là trợ lý chọn sản phẩm văn phòng phẩm Minaco.

Nhiệm vụ:
- Chỉ chọn sản phẩm có trong danh sách products.
- Không bịa sản phẩm ngoài danh sách.
- Không chọn sản phẩm stock <= 0.
- Nếu budgetMax > 0 thì không chọn sản phẩm có price > budgetMax.
- Sắp xếp sản phẩm phù hợp nhất lên đầu.
- Chọn tối đa ${filter.limit} sản phẩm.
- response là 1 câu tiếng Việt ngắn gọn, đúng intent.
- reason là lý do chọn ngắn gọn cho từng sản phẩm.

Intent hiện tại: ${advisorIntent}
Ý nghĩa: ${this.getAdvisorIntentInstruction(advisorIntent)}

Quy tắc theo intent:
${this.getSelectionRuleByIntent(advisorIntent)}

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
        `.trim(),
      ],
      [
        'human',
        `
Câu hỏi:
{question}

Filter:
{filter}

Products:
{products}
        `.trim(),
      ],
    ]);

    const filterJson = JSON.stringify(filter);
    const productsJson = JSON.stringify(products);

    const chain = prompt.pipe(this.aiLlmService.client).pipe(new JsonOutputParser());

    const result = (await chain.invoke({
      question,
      filter: filterJson,
      products: productsJson,
    })) as ProductAdvisorAiResult;

    console.log('PRODUCT_ADVISOR_AI_RAW_RESULT:', JSON.stringify(result, null, 2));

    return {
      response: result.response || this.buildDefaultAiResponse(advisorIntent),
      intent: 'product',
      selectedItems: Array.isArray(result.selectedItems) ? result.selectedItems : [],
    };
  }

  private normalizeProductSearchFilter(
    input: ProductAdvisorFilter | undefined,
    advisorIntent: ProductAdvisorIntent,
    question: string,
  ): ProductSearchFilter {
    const fallback = this.buildFallbackFilter(question, advisorIntent);

    return {
      keyword: this.normalizeText(input?.keyword) || fallback.keyword,
      audience: this.normalizeText(input?.audience) || fallback.audience,
      need: this.normalizeText(input?.need) || fallback.need,
      category: this.normalizeText(input?.category) || fallback.category,
      brand: this.normalizeText(input?.brand) || fallback.brand,
      budgetMin: this.normalizeNumber(input?.budgetMin) || fallback.budgetMin,
      budgetMax: this.normalizeNumber(input?.budgetMax) || fallback.budgetMax,
      sortBy: this.normalizeSortBy(input?.sortBy as ProductAiSortBy, advisorIntent),
      limit: this.normalizeLimit(input?.limit || fallback.limit, advisorIntent),
    };
  }

  private buildFallbackFilter(
    question: string,
    advisorIntent: ProductAdvisorIntent,
  ): ProductSearchFilter {
    const budgetRange = this.extractBudgetRange(question);

    return {
      keyword: this.buildFallbackKeyword(question),
      audience: '',
      need: '',
      category: '',
      brand: '',
      budgetMin: budgetRange.budgetMin,
      budgetMax: budgetRange.budgetMax,
      sortBy: this.detectSortBy(question, advisorIntent),
      limit: advisorIntent === 'combo_bundle' ? 6 : 4,
    };
  }

  private buildFallbackKeyword(question: string): string {
    return String(question || '')
      .replace(/^(tìm|tim|cho tôi|cho mình|mình cần|toi can|tôi cần)\s+/i, '')
      .replace(/(giá rẻ|loại rẻ|dưới\s+\d+\s*k|tầm\s+\d+\s*k|khoảng\s+\d+\s*k)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractBudgetRange(question: string): {
    budgetMin: number;
    budgetMax: number;
  } {
    const q = String(question || '').toLowerCase();

    if (q.includes('giá rẻ') || q.includes('loại rẻ') || q.includes('rẻ hơn')) {
      return {
        budgetMin: 0,
        budgetMax: 100000,
      };
    }

    const rangeMatch = q.match(
      /từ\s*(\d+(?:[.,]\d+)?)\s*(k|nghìn|ngàn|tr|triệu)?\s*(đến|-)\s*(\d+(?:[.,]\d+)?)\s*(k|nghìn|ngàn|tr|triệu)?/,
    );

    if (rangeMatch) {
      return {
        budgetMin: this.parseMoneyNumber(rangeMatch[1], rangeMatch[2]),
        budgetMax: this.parseMoneyNumber(rangeMatch[4], rangeMatch[5]),
      };
    }

    const maxMatch = q.match(
      /(dưới|duoi|tối đa|toi da|max|không quá|khong qua)\s*(\d+(?:[.,]\d+)?)\s*(k|nghìn|ngàn|tr|triệu)?/,
    );

    if (maxMatch) {
      return {
        budgetMin: 0,
        budgetMax: this.parseMoneyNumber(maxMatch[2], maxMatch[3]),
      };
    }

    const aroundMatch = q.match(
      /(tầm|tam|khoảng|khoang)\s*(\d+(?:[.,]\d+)?)\s*(k|nghìn|ngàn|tr|triệu)?/,
    );

    if (aroundMatch) {
      return {
        budgetMin: 0,
        budgetMax: this.parseMoneyNumber(aroundMatch[2], aroundMatch[3]),
      };
    }

    return {
      budgetMin: 0,
      budgetMax: 0,
    };
  }

  private parseMoneyNumber(rawNumber?: string, rawUnit?: string): number {
    const number = Number(String(rawNumber || '0').replace(',', '.'));

    if (!Number.isFinite(number)) {
      return 0;
    }

    const unit = String(rawUnit || '').toLowerCase();

    if (unit.includes('k') || unit.includes('nghìn') || unit.includes('ngàn')) {
      return Math.round(number * 1000);
    }

    if (unit.includes('tr') || unit.includes('triệu')) {
      return Math.round(number * 1000000);
    }

    return Math.round(number);
  }

  private detectSortBy(question: string, advisorIntent: ProductAdvisorIntent): ProductAiSortBy {
    const q = String(question || '').toLowerCase();

    if (
      advisorIntent === 'cost_saving' ||
      q.includes('giá rẻ') ||
      q.includes('rẻ nhất') ||
      q.includes('rẻ hơn') ||
      q.includes('tiết kiệm') ||
      q.includes('thấp đến cao')
    ) {
      return 'price_asc' as ProductAiSortBy;
    }

    if (q.includes('đắt nhất') || q.includes('cao đến thấp')) {
      return 'price_desc' as ProductAiSortBy;
    }

    return 'relevant' as ProductAiSortBy;
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

  private mapProductsWithoutAi(
    products: AdvisorProduct[],
    filter: ProductSearchFilter,
    advisorIntent: ProductAdvisorIntent,
  ): ProductAdvisorItem[] {
    return products.slice(0, filter.limit).map((product, index) => ({
      ...(product as any),
      aiReason: this.buildDefaultItemReason(advisorIntent),
      aiScore: Number(Math.max(0.5, 0.85 - index * 0.05).toFixed(2)),
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

  private normalizeText(value?: string): string {
    return String(value || '').trim();
  }

  private normalizeNumber(value?: number): number {
    const number = Number(value || 0);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return Math.max(0, Math.round(number));
  }

  private normalizeAdvisorIntent(intent?: ProductAdvisorIntent): ProductAdvisorIntent {
    const allowedIntents: ProductAdvisorIntent[] = [
      'general',
      'recommend_by_budget',
      'quality_durability',
      'brand_fit',
      'cost_saving',
      'combo_bundle',
      'alternative_product',
      'quantity_advice',
    ];

    if (intent && allowedIntents.includes(intent)) {
      return intent;
    }

    return 'general';
  }

  private normalizeSortBy(
    sortBy?: ProductAiSortBy,
    advisorIntent: ProductAdvisorIntent = 'general',
  ): ProductAiSortBy {
    const value = String(sortBy || 'relevant');

    if (value === 'price_asc') {
      return 'price_asc' as ProductAiSortBy;
    }

    if (value === 'price_desc') {
      return 'price_desc' as ProductAiSortBy;
    }

    if (advisorIntent === 'cost_saving') {
      return 'price_asc' as ProductAiSortBy;
    }

    return 'relevant' as ProductAiSortBy;
  }

  private normalizeLimit(limit?: number, advisorIntent: ProductAdvisorIntent = 'general'): number {
    const defaultLimit = advisorIntent === 'combo_bundle' ? 6 : 4;
    const maxLimit = advisorIntent === 'combo_bundle' ? 6 : 4;

    const value = Number(limit || defaultLimit);

    if (!Number.isFinite(value)) {
      return defaultLimit;
    }

    return Math.min(Math.max(value, 1), maxLimit);
  }

  private getAdvisorIntentInstruction(intent: ProductAdvisorIntent): string {
    switch (intent) {
      case 'recommend_by_budget':
        return 'Người dùng muốn tìm sản phẩm theo ngân sách, khoảng giá hoặc tầm giá.';

      case 'quality_durability':
        return 'Người dùng muốn tư vấn chất lượng, độ bền, dùng lâu có ổn không, sản phẩm có tốt không.';

      case 'brand_fit':
        return 'Người dùng muốn tư vấn thương hiệu, hãng hoặc brand phù hợp với nhu cầu.';

      case 'cost_saving':
        return 'Người dùng muốn tiết kiệm chi phí, mua rẻ hơn, tối ưu ngân sách hoặc chọn sản phẩm giá tốt.';

      case 'combo_bundle':
        return 'Người dùng muốn tư vấn combo, bộ sản phẩm, sản phẩm mua kèm hoặc sản phẩm đi cùng.';

      case 'alternative_product':
        return 'Người dùng muốn tìm sản phẩm thay thế, sản phẩm tương tự hoặc lựa chọn khác phù hợp hơn.';

      case 'quantity_advice':
        return 'Người dùng muốn tư vấn số lượng nên mua theo số người dùng, thời gian sử dụng hoặc tần suất sử dụng.';

      case 'general':
      default:
        return 'Người dùng muốn tư vấn sản phẩm chung.';
    }
  }

  private getSelectionRuleByIntent(intent: ProductAdvisorIntent): string {
    switch (intent) {
      case 'recommend_by_budget':
        return '- Ưu tiên sản phẩm nằm trong ngân sách, giá hợp lý, còn hàng.';

      case 'quality_durability':
        return '- Ưu tiên sản phẩm có thương hiệu rõ ràng, phù hợp dùng thường xuyên, không quá rẻ bất thường.';

      case 'brand_fit':
        return '- Ưu tiên sản phẩm có brandName rõ ràng. Nếu người dùng nhắc thương hiệu cụ thể thì ưu tiên đúng thương hiệu đó.';

      case 'cost_saving':
        return '- Ưu tiên sản phẩm giá tốt, giá thấp hơn, hoặc có compareAtPrice cao hơn price nếu có.';

      case 'combo_bundle':
        return '- Ưu tiên sản phẩm có thể mua kèm hoặc bổ trợ cho sản phẩm chính trong câu hỏi.';

      case 'alternative_product':
        return '- Ưu tiên sản phẩm tương tự, cùng nhóm, cùng công dụng hoặc có thể thay thế.';

      case 'quantity_advice':
        return '- Ưu tiên sản phẩm phù hợp để mua theo số lượng, dùng cho nhóm người hoặc dùng định kỳ.';

      case 'general':
      default:
        return '- Chọn sản phẩm phù hợp chung với nhu cầu người dùng.';
    }
  }

  private buildDefaultAiResponse(intent: ProductAdvisorIntent): string {
    switch (intent) {
      case 'quality_durability':
        return 'Mình đã chọn một số sản phẩm phù hợp nếu bạn ưu tiên chất lượng và độ bền.';

      case 'brand_fit':
        return 'Mình đã chọn một số sản phẩm có thương hiệu phù hợp với nhu cầu của bạn.';

      case 'cost_saving':
        return 'Mình đã chọn một số sản phẩm phù hợp nếu bạn muốn tiết kiệm chi phí.';

      case 'combo_bundle':
        return 'Mình đã chọn một số sản phẩm phù hợp để mua kèm hoặc ghép thành combo.';

      case 'recommend_by_budget':
        return 'Mình đã chọn một số sản phẩm phù hợp với ngân sách của bạn.';

      case 'alternative_product':
        return 'Mình đã chọn một số sản phẩm có thể thay thế phù hợp.';

      case 'quantity_advice':
        return 'Mình đã chọn một số sản phẩm phù hợp để mua theo số lượng sử dụng.';

      case 'general':
      default:
        return 'Mình tìm thấy sản phẩm phù hợp với nhu cầu của bạn.';
    }
  }

  private buildDefaultItemReason(intent: ProductAdvisorIntent): string {
    switch (intent) {
      case 'quality_durability':
        return 'Phù hợp nếu bạn ưu tiên chất lượng và dùng thường xuyên.';

      case 'brand_fit':
        return 'Có thương hiệu/thông tin sản phẩm phù hợp với nhu cầu.';

      case 'cost_saving':
        return 'Phù hợp nếu bạn muốn tối ưu chi phí.';

      case 'combo_bundle':
        return 'Phù hợp để mua kèm hoặc bổ sung cho nhu cầu hiện tại.';

      case 'recommend_by_budget':
        return 'Phù hợp với khoảng giá và nhu cầu tìm kiếm.';

      case 'alternative_product':
        return 'Có thể là lựa chọn thay thế phù hợp.';

      case 'quantity_advice':
        return 'Phù hợp để mua theo số lượng hoặc dùng định kỳ.';

      case 'general':
      default:
        return 'Phù hợp với yêu cầu tìm kiếm.';
    }
  }

  private buildNoProductResponse(intent: ProductAdvisorIntent): string {
    switch (intent) {
      case 'quality_durability':
        return 'Mình chưa tìm thấy sản phẩm phù hợp để tư vấn chất lượng và độ bền. Bạn có thể mô tả rõ hơn tên sản phẩm hoặc nhu cầu sử dụng nhé.';

      case 'brand_fit':
        return 'Mình chưa tìm thấy sản phẩm phù hợp để so sánh thương hiệu. Bạn có thể nói rõ nhóm sản phẩm cần mua nhé.';

      case 'cost_saving':
        return 'Mình chưa tìm thấy sản phẩm phù hợp để tối ưu chi phí. Bạn có thể mở rộng khoảng giá hoặc mô tả nhu cầu rộng hơn nhé.';

      case 'combo_bundle':
        return 'Mình chưa tìm thấy sản phẩm phù hợp để gợi ý combo hoặc mua kèm. Bạn có thể nói rõ sản phẩm chính muốn mua nhé.';

      case 'recommend_by_budget':
        return 'Mình chưa tìm thấy sản phẩm phù hợp với ngân sách này. Bạn có thể tăng ngân sách hoặc mô tả rộng hơn nhé.';

      case 'alternative_product':
        return 'Mình chưa tìm thấy sản phẩm thay thế phù hợp. Bạn có thể nói rõ sản phẩm gốc hoặc nhu cầu sử dụng nhé.';

      case 'quantity_advice':
        return 'Mình chưa tìm thấy sản phẩm phù hợp để tư vấn số lượng. Bạn có thể nói rõ sản phẩm và số người dùng nhé.';

      case 'general':
      default:
        return 'Mình chưa tìm thấy sản phẩm phù hợp với yêu cầu này. Bạn có thể mô tả rộng hơn hoặc tăng ngân sách một chút nhé.';
    }
  }
  private getCandidateLimit(advisorIntent: ProductAdvisorIntent): number {
    if (advisorIntent === 'combo_bundle') {
      return 30;
    }

    if (advisorIntent === 'alternative_product') {
      return 30;
    }

    if (advisorIntent === 'quantity_advice') {
      return 20;
    }

    return 24;
  }
}
