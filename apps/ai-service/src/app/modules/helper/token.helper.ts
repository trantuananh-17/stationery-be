import { ChatTokenUsageDto } from '../dto/product-ai.dto';

/**
 * Chỉ khai những field thật sự được đọc. Mỗi provider LLM đặt tên một kiểu
 * (snake_case của OpenAI, camelCase của LangChain) nên phải chấp nhận cả hai.
 */
type TokenUsageSource = {
  usage_metadata?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  response_metadata?: {
    tokenUsage?: Record<string, number | undefined>;
    token_usage?: Record<string, number | undefined>;
  };
};

export function emptyTokenUsage(): ChatTokenUsageDto {
  return {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
}

export function extractTokenUsage(message?: TokenUsageSource | null): ChatTokenUsageDto {
  const usageMetadata = message?.usage_metadata;

  if (usageMetadata) {
    return {
      inputTokens: Number(usageMetadata.input_tokens || 0),
      outputTokens: Number(usageMetadata.output_tokens || 0),
      totalTokens: Number(usageMetadata.total_tokens || 0),
    };
  }

  const tokenUsage =
    message?.response_metadata?.tokenUsage || message?.response_metadata?.token_usage;

  if (tokenUsage) {
    const inputTokens = Number(
      tokenUsage.promptTokens || tokenUsage.prompt_tokens || tokenUsage.input_tokens || 0,
    );

    const outputTokens = Number(
      tokenUsage.completionTokens || tokenUsage.completion_tokens || tokenUsage.output_tokens || 0,
    );

    const totalTokens = Number(
      tokenUsage.totalTokens || tokenUsage.total_tokens || inputTokens + outputTokens || 0,
    );

    return {
      inputTokens,
      outputTokens,
      totalTokens,
    };
  }

  return emptyTokenUsage();
}

export function sumTokenUsage(
  ...items: Array<ChatTokenUsageDto | undefined | null>
): ChatTokenUsageDto {
  return items.reduce<ChatTokenUsageDto>((total, item) => {
    if (!item) {
      return total;
    }

    return {
      inputTokens: total.inputTokens + Number(item.inputTokens || 0),
      outputTokens: total.outputTokens + Number(item.outputTokens || 0),
      totalTokens: total.totalTokens + Number(item.totalTokens || 0),
    };
  }, emptyTokenUsage());
}
