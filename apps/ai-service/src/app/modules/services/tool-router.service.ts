import { Injectable } from '@nestjs/common';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AiLlmService } from './ai-llm.service';
import { ChatTokenUsageDto } from '../dto/product-ai.dto';
import { extractTokenUsage } from '../helper/token.helper';

export type ChatToolName = 'ask_rag' | 'get_product_advisor';

export type ProductAdvisorIntent =
  | 'general'
  | 'recommend_by_budget'
  | 'quality_durability'
  | 'brand_fit'
  | 'cost_saving'
  | 'combo_bundle'
  | 'alternative_product'
  | 'quantity_advice';

export type ProductAdvisorSortBy = 'relevant' | 'price_asc' | 'price_desc';

export type ProductAdvisorFilter = {
  keyword: string;
  audience: string;
  need: string;
  category: string;
  brand: string;
  budgetMin: number;
  budgetMax: number;
  sortBy: ProductAdvisorSortBy;
  limit: number;
};

export type ToolChoiceResult = {
  name: ChatToolName;
  question: string;
  intent?: ProductAdvisorIntent;
  filter?: ProductAdvisorFilter;
  tokenUsage?: ChatTokenUsageDto;
};

@Injectable()
export class ToolRouterService {
  constructor(private readonly aiLlmService: AiLlmService) {}

  async chooseTool(question: string): Promise<ToolChoiceResult> {
    const tools = this.getChatTools();

    const llmWithTools = this.aiLlmService.client.bindTools(tools, {
      tool_choice: 'required',
    } as any);

    const toolChoiceMessage = await llmWithTools.invoke([
      new SystemMessage(
        `
Bạn là bộ điều phối tool cho chatbot Minaco.

Nhiệm vụ:
- Chỉ chọn đúng MỘT tool.
- Không trả lời trực tiếp người dùng.
- Nếu hỏi chính sách, quy trình, thanh toán, vận chuyển, đổi trả, bảo hành, liên hệ => chọn ask_rag.
- Nếu hỏi tìm, chọn, mua, so sánh, gợi ý hoặc tư vấn sản phẩm => chọn get_product_advisor.

Nếu chọn get_product_advisor:
- Phải chọn intent phù hợp.
- Phải trích xuất filter tìm sản phẩm ngay trong tool args.
- keyword là cụm sản phẩm chính, giữ lại màu sắc/kích thước/loại/công dụng nếu có.
- Nếu có thương hiệu/hãng thì đưa vào brand.
- "giá rẻ" hoặc "loại rẻ" => budgetMax = 100000 và sortBy = price_asc.
- "dưới 100k" => budgetMax = 100000.
- "tầm/khoảng 50k" => budgetMax = 50000.
- Không có ngân sách => budgetMin = 0, budgetMax = 0.
- Không rõ intent sản phẩm => dùng general.

Intent:
- general: tư vấn sản phẩm chung
- recommend_by_budget: hỏi theo ngân sách, khoảng giá, tầm giá
- quality_durability: hỏi chất lượng, độ bền, dùng lâu, tốt hay không
- brand_fit: hỏi thương hiệu, hãng, brand phù hợp
- cost_saving: hỏi tiết kiệm chi phí, mua rẻ hơn, tối ưu ngân sách
- combo_bundle: hỏi combo, bộ sản phẩm, mua kèm, sản phẩm đi cùng
- alternative_product: hỏi sản phẩm thay thế hoặc tương tự
- quantity_advice: hỏi số lượng nên mua
        `.trim(),
      ),
      new HumanMessage(question),
    ]);

    const routerTokenUsage = extractTokenUsage(toolChoiceMessage);

    console.log('TOOL_ROUTER_TOKEN_USAGE:', routerTokenUsage);

    const toolCall = toolChoiceMessage.tool_calls?.[0];

    if (!toolCall) {
      return {
        name: 'ask_rag',
        question,
        tokenUsage: routerTokenUsage,
      };
    }

    console.log('GPT SELECTED TOOL:', toolCall.name);
    console.log('TOOL ARGS:', toolCall.args);

    const selectedToolName = this.normalizeToolName(toolCall.name);

    if (selectedToolName === 'ask_rag') {
      const args = toolCall.args as {
        question?: string;
      };

      return {
        name: 'ask_rag',
        question: args?.question || question,
        tokenUsage: routerTokenUsage,
      };
    }

    const args = toolCall.args as {
      question?: string;
      intent?: string;
      keyword?: string;
      audience?: string;
      need?: string;
      category?: string;
      brand?: string;
      budgetMin?: number | string;
      budgetMax?: number | string;
      sortBy?: string;
      limit?: number | string;
    };

    const intent = this.normalizeProductAdvisorIntent(args?.intent);

    return {
      name: 'get_product_advisor',
      question: args?.question || question,
      intent,
      filter: this.buildProductAdvisorFilter(args, intent),
      tokenUsage: routerTokenUsage,
    };
  }

  private normalizeToolName(name?: string): ChatToolName {
    if (name === 'get_product_advisor') {
      return 'get_product_advisor';
    }

    return 'ask_rag';
  }

  private normalizeProductAdvisorIntent(intent?: string): ProductAdvisorIntent {
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

    if (intent && allowedIntents.includes(intent as ProductAdvisorIntent)) {
      return intent as ProductAdvisorIntent;
    }

    return 'general';
  }

  private buildProductAdvisorFilter(
    args: {
      keyword?: string;
      audience?: string;
      need?: string;
      category?: string;
      brand?: string;
      budgetMin?: number | string;
      budgetMax?: number | string;
      sortBy?: string;
      limit?: number | string;
    },
    intent: ProductAdvisorIntent,
  ): ProductAdvisorFilter {
    return {
      keyword: this.normalizeText(args.keyword),
      audience: this.normalizeText(args.audience),
      need: this.normalizeText(args.need),
      category: this.normalizeText(args.category),
      brand: this.normalizeText(args.brand),
      budgetMin: this.normalizeNumber(args.budgetMin),
      budgetMax: this.normalizeNumber(args.budgetMax),
      sortBy: this.normalizeSortBy(args.sortBy, intent),
      limit: this.normalizeLimit(args.limit, intent),
    };
  }

  private normalizeText(value?: string): string {
    return String(value || '').trim();
  }

  private normalizeNumber(value?: number | string): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    const raw = String(value || '')
      .trim()
      .toLowerCase();

    if (!raw) {
      return 0;
    }

    const match = raw.match(/(\d+(?:[.,]\d+)?)/);

    if (!match) {
      return 0;
    }

    const number = Number(match[1].replace(',', '.'));

    if (!Number.isFinite(number)) {
      return 0;
    }

    if (raw.includes('k') || raw.includes('nghìn') || raw.includes('ngàn')) {
      return Math.round(number * 1000);
    }

    if (raw.includes('tr') || raw.includes('triệu')) {
      return Math.round(number * 1000000);
    }

    return Math.round(number);
  }

  private normalizeSortBy(
    sortBy?: string,
    intent: ProductAdvisorIntent = 'general',
  ): ProductAdvisorSortBy {
    if (sortBy === 'price_asc') {
      return 'price_asc';
    }

    if (sortBy === 'price_desc') {
      return 'price_desc';
    }

    if (intent === 'cost_saving') {
      return 'price_asc';
    }

    return 'relevant';
  }

  private normalizeLimit(
    limit?: number | string,
    intent: ProductAdvisorIntent = 'general',
  ): number {
    const defaultLimit = intent === 'combo_bundle' ? 6 : 4;
    const maxLimit = intent === 'combo_bundle' ? 6 : 4;

    const value = Number(limit || defaultLimit);

    if (!Number.isFinite(value)) {
      return defaultLimit;
    }

    return Math.min(Math.max(value, 1), maxLimit);
  }

  private getChatTools() {
    return [
      {
        type: 'function',
        function: {
          name: 'ask_rag',
          description: [
            'Trả lời câu hỏi thông tin dựa trên tài liệu/vector database.',
            'Dùng cho chính sách, hướng dẫn mua hàng, đặt hàng, thanh toán, vận chuyển, đổi trả, hoàn tiền, bảo hành, liên hệ, thời gian làm việc.',
            'Không dùng để tìm hoặc tư vấn sản phẩm cụ thể.',
          ].join(' '),
          parameters: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'Câu hỏi gốc của người dùng',
              },
            },
            required: ['question'],
            additionalProperties: false,
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_product_advisor',
          description: [
            'Tìm và tư vấn sản phẩm từ database sản phẩm thật.',
            'Dùng khi người dùng muốn tìm sản phẩm, chọn sản phẩm, hỏi sản phẩm phù hợp, gợi ý sản phẩm theo nhu cầu, đối tượng, danh mục, thương hiệu, ngân sách hoặc khoảng giá.',
            'Dùng cho tư vấn chất lượng, độ bền, thương hiệu phù hợp, tiết kiệm chi phí, combo, bộ sản phẩm, mua kèm, sản phẩm thay thế và số lượng nên mua.',
            'Không dùng cho câu hỏi về quy trình mua hàng, thanh toán, vận chuyển, đổi trả hoặc bảo hành.',
          ].join(' '),
          parameters: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'Câu hỏi gốc của người dùng',
              },
              intent: {
                type: 'string',
                enum: [
                  'general',
                  'recommend_by_budget',
                  'quality_durability',
                  'brand_fit',
                  'cost_saving',
                  'combo_bundle',
                  'alternative_product',
                  'quantity_advice',
                ],
                description: 'Intent tư vấn sản phẩm.',
              },
              keyword: {
                type: 'string',
                description:
                  'Cụm sản phẩm chính người dùng muốn tìm. Giữ lại màu sắc, kích thước, loại, công dụng nếu có.',
              },
              audience: {
                type: 'string',
                description:
                  'Đối tượng sử dụng nếu có. Ví dụ: học sinh, sinh viên, văn phòng, giáo viên, kế toán, kho vận.',
              },
              need: {
                type: 'string',
                description:
                  'Nhu cầu sử dụng nếu có. Ví dụ: viết hằng ngày, in tài liệu, lưu hồ sơ, đóng gói hàng, ghi chú.',
              },
              category: {
                type: 'string',
                description:
                  'Danh mục/nhóm sản phẩm nếu người dùng nói rõ, không có thì chuỗi rỗng.',
              },
              brand: {
                type: 'string',
                description: 'Thương hiệu/hãng nếu người dùng nói rõ, không có thì chuỗi rỗng.',
              },
              budgetMin: {
                type: 'integer',
                description: 'Ngân sách tối thiểu. Không có thì 0.',
              },
              budgetMax: {
                type: 'integer',
                description:
                  'Ngân sách tối đa. Ví dụ dưới 100k => 100000, giá rẻ => 100000, không có thì 0.',
              },
              sortBy: {
                type: 'string',
                enum: ['relevant', 'price_asc', 'price_desc'],
                description:
                  'Cách sắp xếp. Giá rẻ/tiết kiệm/thấp đến cao => price_asc. Cao đến thấp => price_desc. Còn lại => relevant.',
              },
              limit: {
                type: 'integer',
                description:
                  'Số lượng sản phẩm cần lấy. Mặc định 4. Nếu intent là combo_bundle thì mặc định 6. Không vượt quá 4 với tư vấn thường và 6 với combo.',
              },
            },
            required: [
              'question',
              'intent',
              'keyword',
              'audience',
              'need',
              'category',
              'brand',
              'budgetMin',
              'budgetMax',
              'sortBy',
              'limit',
            ],
            additionalProperties: false,
          },
        },
      },
    ] as any[];
  }
}
