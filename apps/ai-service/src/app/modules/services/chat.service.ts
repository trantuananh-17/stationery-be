import { Injectable } from '@nestjs/common';

import { IngestBodyDto } from '../dto/ingest.dto';
import { VectorStoreService } from './vector-store.service';
import { ToolRouterService } from './tool-router.service';
import { RagToolService } from './rag-tool.service';
import { ProductAdvisorToolService } from './product-advisor-tool.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly toolRouterService: ToolRouterService,
    private readonly ragToolService: RagToolService,
    private readonly productAdvisorToolService: ProductAdvisorToolService,
  ) {}

  async handleFileUpload(files: Express.Multer.File[]) {
    return this.vectorStoreService.handleFileUpload(files);
  }

  async ingest(body: IngestBodyDto) {
    return this.vectorStoreService.ingest(body);
  }

  async query(question: string) {
    console.time('TOTAL');

    if (!question?.trim()) {
      console.timeEnd('TOTAL');

      return {
        success: false,
        message: 'Empty question',
      };
    }

    const toolChoice = await this.toolRouterService.chooseTool(question);

    let result: any;

    switch (toolChoice.name) {
      case 'get_product_advisor':
        result = await this.productAdvisorToolService.advise(toolChoice.question);
        break;

      case 'ask_rag':
      default:
        result = await this.ragToolService.ask(toolChoice.question);
        break;
    }

    console.timeEnd('TOTAL');

    return result;
  }
}
