import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_EMBEDDING_MODEL = 'perplexity/pplx-embed-v1-0.6b';

/**
 * Nguồn embedding duy nhất của ai-service.
 *
 * Qdrant chốt số chiều vector ngay lúc tạo collection, nên số chiều phải biết
 * trước khi ghi điểm đầu tiên: lấy từ env nếu có, không thì đo bằng một lần
 * embed thử rồi nhớ lại.
 *
 * Dựng trong constructor thay vì `onModuleInit` vì các service khác gọi ngay ở
 * hook khởi động của chúng — Nest không bảo đảm thứ tự giữa các hook.
 */
@Injectable()
export class EmbeddingService {
  private readonly embeddings: EmbeddingsInterface;

  private dimension: number;

  constructor(private readonly configService: ConfigService) {
    this.embeddings = new OpenAIEmbeddings({
      apiKey: this.configService.getOrThrow<string>('OPENROUTER_API_KEY'),
      model:
        this.configService.get<string>('EMBEDDING_MODEL') ??
        this.configService.get<string>('OPENAI_EMBEDDING_MODEL', DEFAULT_EMBEDDING_MODEL),
      configuration: {
        baseURL: this.configService.get<string>(
          'OPENROUTER_BASE_URL',
          'https://openrouter.ai/api/v1',
        ),
      },
    });

    this.dimension = Number(this.configService.get<string>('EMBEDDING_DIMENSION', '0')) || 0;
  }

  embedQuery(text: string): Promise<number[]> {
    return this.embeddings.embedQuery(text);
  }

  embedDocuments(texts: string[]): Promise<number[][]> {
    return this.embeddings.embedDocuments(texts);
  }

  async getDimension(): Promise<number> {
    if (this.dimension > 0) return this.dimension;

    const probe = await this.embeddings.embedQuery('dimension probe');

    this.dimension = probe.length;

    return this.dimension;
  }
}
