import { Injectable } from '@nestjs/common';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AiLlmService } from './ai-llm.service';

export type ChatToolName = 'ask_rag' | 'get_product_advisor';

export type ToolChoiceResult = {
  name: ChatToolName;
  question: string;
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

Nhiệm vụ của bạn là chọn đúng MỘT tool phù hợp nhất với câu hỏi của người dùng.

TOOL 1: ask_rag
Dùng khi người dùng hỏi thông tin, hướng dẫn, chính sách, quy trình.
Ví dụ:
- Cách đặt hàng
- Thanh toán
- Vận chuyển
- Giao hàng
- Phí ship
- Đổi trả
- Hoàn tiền
- Bảo hành
- Liên hệ
- Địa chỉ
- Hotline
- Thời gian làm việc

TOOL 2: get_product_advisor
Dùng khi người dùng muốn tìm, chọn, mua, so sánh, gợi ý hoặc tư vấn sản phẩm.
Ví dụ:
- Tìm bút đỏ giá rẻ
- Có giấy A4 không?
- Học sinh nên mua bút gì?
- Tìm sản phẩm dưới 100k
- So sánh bút bi và bút gel
- Sản phẩm nào phù hợp để đi học?

QUY TẮC:
- Hỏi quy trình/chính sách/thông tin shop => ask_rag.
- Hỏi tìm/chọn/tư vấn sản phẩm => get_product_advisor.
- Không trả lời trực tiếp.
- Chỉ chọn tool.
        `.trim(),
      ),
      new HumanMessage(question),
    ]);

    const toolCall = toolChoiceMessage.tool_calls?.[0];

    if (!toolCall) {
      return {
        name: 'ask_rag',
        question,
      };
    }

    console.log('GPT SELECTED TOOL:', toolCall.name);
    console.log('TOOL ARGS:', toolCall.args);

    const args = toolCall.args as {
      question?: string;
    };

    return {
      name: toolCall.name as ChatToolName,
      question: args?.question || question,
    };
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
            'Không dùng cho câu hỏi về quy trình mua hàng, thanh toán, vận chuyển, đổi trả hoặc bảo hành.',
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
    ] as any[];
  }
}
