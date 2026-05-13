import { Injectable } from '@nestjs/common';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { VectorStoreService } from './vector-store.service';
import { AiLlmService } from './ai-llm.service';
import { rewriteQuery } from '../helper/query-rewrite';

type RagChatResponse = {
  response: string;
  intent: 'policy' | 'support' | 'general';
};

@Injectable()
export class RagToolService {
  constructor(
    private readonly aiLlmService: AiLlmService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async ask(question: string) {
    if (!question?.trim()) {
      return {
        success: false,
        message: 'Empty question',
      };
    }

    const searchQuery = rewriteQuery(question);

    console.log('RAG_ORIGINAL_QUESTION:', question);
    console.log('RAG_SEARCH_QUERY:', searchQuery);

    const docs = await this.vectorStoreService.similaritySearch(searchQuery, 8, 4);

    const context = docs.map((doc) => doc.pageContent).join('\n\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
Bạn là trợ lý AI của Minaco.

NGUYÊN TẮC:
- CHỈ được sử dụng thông tin từ Context để trả lời.
- TUYỆT ĐỐI KHÔNG được dùng kiến thức bên ngoài.
- KHÔNG được suy diễn hoặc bịa thêm.
- Nếu Context không chứa thông tin trả lời:
  → trả:
  "Xin lỗi, mình chưa có thông tin về vấn đề này 😢"

THÁI ĐỘ:
- Luôn lịch sự, tôn trọng khách hàng.
- Dùng ngôn từ thân thiện, dễ hiểu.
- Không sử dụng từ ngữ tiêu cực, xúc phạm hoặc thiếu tôn trọng.
- Luôn thể hiện sự hỗ trợ và thiện chí.

ĐỊNH DẠNG TRẢ VỀ JSON:
{{
  "response": "Câu trả lời đầy đủ, rõ ràng, lịch sự",
  "intent": "policy|support|general"
}}
        `,
      ],
      [
        'human',
        `
Câu hỏi:
{question}

Context:
{context}
        `,
      ],
    ]);

    const formattedPrompt = await prompt.format({
      question,
      context,
    });

    console.log('RAG_FINAL_PROMPT:\n', formattedPrompt);

    const chain = prompt.pipe(this.aiLlmService.client).pipe(new JsonOutputParser());

    const result = (await chain.invoke({
      question,
      context,
    })) as RagChatResponse;

    return {
      success: true,
      tool: 'ask_rag',
      ...result,
      contextUsed: docs.length,
    };
  }
}
