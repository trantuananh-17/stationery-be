import { ProductAdvisorIntent, ProductAdvisorFilter } from '../services/tool-router.service';
import { ChatTokenUsageDto } from './product-ai.dto';

export type ChatToolName = 'ask_rag' | 'get_product_advisor';

export type ChatResponseIntent = 'policy' | 'support' | 'general' | 'product';

export type ProductSelectionMode = 'none' | 'direct' | 'ai';

export type ChatProductItemDto = {
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

export type ChatToolResponseDto = {
  success: boolean;
  tool: ChatToolName;
  intent: ChatResponseIntent;
  response: string;

  advisorIntent?: ProductAdvisorIntent;
  filter?: ProductAdvisorFilter;
  total?: number;
  candidateCount?: number;
  selectionMode?: ProductSelectionMode;
  items?: ChatProductItemDto[];

  message?: string;

  tokenUsage?: ChatTokenUsageDto;
  quantityAdvice?: ChatQuantityAdviceDto;
};

export type ChatQuantityAdviceDto = {
  subjectCount: number;
  subjectLabel: string;
  productKeyword: string;
  recommendedMin: number;
  recommendedMax: number;
  unit: string;
  formula: string;
  note: string;
};
