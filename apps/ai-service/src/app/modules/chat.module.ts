import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { ClientsModule } from '@nestjs/microservices';
import { ProductAiGrpcClientService } from './services/product-ai.service';
import { ProductAiController } from './controllers/product-ai.controller';
import { AiLlmService } from './services/ai-llm.service';
import { VectorStoreService } from './services/vector-store.service';
import { ToolRouterService } from './services/tool-router.service';
import { RagToolService } from './services/rag-tool.service';
import { ProductAdvisorToolService } from './services/product-advisor-tool.service';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE)])],
  controllers: [ChatController, ProductAiController],
  providers: [
    ChatService,
    AiLlmService,
    VectorStoreService,
    ToolRouterService,
    RagToolService,
    ProductAdvisorToolService,
    ProductAiGrpcClientService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
