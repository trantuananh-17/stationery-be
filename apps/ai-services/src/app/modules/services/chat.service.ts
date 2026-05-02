import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { IngestBodyDto } from '../dto/ingest.dto';
import { loadPdfAsDocuments } from '../helper/pdf.loader';
import { rewriteQuery } from '../helper/query-rewrite';

type ChatResponse = {
  response: string;
  intent: string;
};

@Injectable()
export class ChatService implements OnModuleInit {
  private llm!: ChatOpenAI;
  private embeddings!: OllamaEmbeddings;
  private vectorStore!: PGVectorStore;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.init();
  }

  async init(): Promise<void> {
    this.llm = new ChatOpenAI({
      apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
      model: this.configService.get<string>('OPENROUTER_MODEL', 'openai/gpt-4o-mini'),
      temperature: 0,
      maxTokens: 300,
    });

    this.embeddings = new OllamaEmbeddings({
      model: this.configService.get<string>('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text'),
      baseUrl: this.configService.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434'),
    });

    this.vectorStore = await PGVectorStore.initialize(this.embeddings, {
      postgresConnectionOptions: {
        type: 'postgres',
        host: this.configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: Number(this.configService.get<string>('POSTGRES_PORT', '5432')),
        user: this.configService.get<string>('POSTGRES_USER', 'postgres'),
        password: this.configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
        database: this.configService.get<string>('POSTGRES_DB', 'chatbot_db'),
      },
      tableName: this.configService.get<string>('PGVECTOR_TABLE', 'chatbot_documents'),
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'embedding',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
      },
    });

    console.log('PGVector ready');
  }

  async handleFileUpload(files: Express.Multer.File[]) {
    if (!files?.length) {
      return { success: false, message: 'No files uploaded' };
    }

    const results = [];

    for (const file of files) {
      const result = await this.insertPdfToVectorDb(file.path);
      results.push({
        file: file.originalname,
        ...result,
      });
    }

    return {
      success: true,
      files: results,
    };
  }

  async insertPdfToVectorDb(filePath: string) {
    console.time('INSERT_PDF_TO_VECTOR_DB');

    const documents = await loadPdfAsDocuments(filePath);

    console.log('TOTAL DOCUMENTS TO INSERT:', documents.length);

    // XÓA DATA CŨ THEO FILE
    await (this.vectorStore as any).pool.query(
      `DELETE FROM chatbot_documents WHERE metadata->>'source' = $1`,
      [filePath],
    );

    // INSERT LẠI
    await this.vectorStore.addDocuments(documents);

    console.timeEnd('INSERT_PDF_TO_VECTOR_DB');

    return {
      success: true,
      chunksAdded: documents.length,
    };
  }

  async ingest(body: IngestBodyDto) {
    const textDocs: Document[] = (body.docs || []).map(
      (d) =>
        new Document({
          pageContent: d.content,
          metadata: { source: d.meta?.source ?? 'inline', ...d.meta },
        }),
    );

    const pdfDocs: Document[] = [];

    for (const p of body.pdfPaths || []) {
      const docs = await loadPdfAsDocuments(p);
      pdfDocs.push(...docs);
    }

    const allDocs = [...textDocs, ...pdfDocs];

    if (!allDocs.length) {
      return { success: false, message: 'No documents' };
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 100,
    });

    const finalChunks = await splitter.splitDocuments(allDocs);

    await this.vectorStore.addDocuments(finalChunks);

    return {
      success: true,
      chunksAdded: finalChunks.length,
    };
  }

  async query(question: string) {
    const searchQuery = rewriteQuery(question);
    console.time('TOTAL');

    if (!question?.trim()) {
      console.timeEnd('TOTAL');
      return { success: false, message: 'Empty question' };
    }

    console.time('vectorSearch');
    const results = await this.vectorStore.similaritySearchWithScore(searchQuery, 5);
    console.timeEnd('vectorSearch');

    console.time('filterDocs');
    const docs = results
      .sort((a, b) => a[1] - b[1])
      .map(([doc]) => doc)
      .slice(0, 3);
    console.timeEnd('filterDocs');

    const context = docs.map((doc) => doc.pageContent).join('\n\n');

    console.time('buildPrompt');
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
Bạn là trợ lý AI của Minaco.

NGUYÊN TẮC:
- CHỈ được sử dụng thông tin từ Context để trả lời
- TUYỆT ĐỐI KHÔNG được dùng kiến thức bên ngoài
- KHÔNG được suy diễn hoặc bịa thêm
- Nếu Context không chứa thông tin trả lời:
  → trả:
  "Xin lỗi, mình chưa có thông tin về vấn đề này 😢"

THÁI ĐỘ:
- Luôn lịch sự, tôn trọng khách hàng
- Dùng ngôn từ thân thiện, dễ hiểu
- Không sử dụng từ ngữ tiêu cực, xúc phạm, hoặc thiếu tôn trọng
- Luôn thể hiện sự hỗ trợ và thiện chí

ĐỊNH DẠNG TRẢ VỀ (JSON):
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

    console.log(prompt);

    console.timeEnd('buildPrompt');

    console.time('llmAnswer');
    const chain = prompt.pipe(this.llm).pipe(new JsonOutputParser());

    const result = (await chain.invoke({
      question,
      context,
    })) as ChatResponse;

    const formatted = await prompt.format({
      question,
      context,
    });

    console.log(formatted);
    console.timeEnd('TOTAL');

    return {
      success: true,
      ...result,
      contextUsed: docs.length,
    };
  }
}
