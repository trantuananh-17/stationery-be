import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AiLlmService implements OnModuleInit {
  private llm!: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.llm = new ChatOpenAI({
      apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
      model: this.configService.get<string>('OPENROUTER_MODEL', 'openai/gpt-4o-mini'),
      temperature: 0,
      maxTokens: 1000,
    });
  }

  get client(): ChatOpenAI {
    if (!this.llm) {
      throw new Error('LLM has not been initialized');
    }

    return this.llm;
  }
}
