import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OllamaEmbeddings } from '@langchain/ollama';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

import { IngestBodyDto } from '../dto/ingest.dto';
import { loadPdfAsDocuments } from '../helper/pdf.loader';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private embeddings!: OllamaEmbeddings;
  private vectorStore!: PGVectorStore;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
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
      return {
        success: false,
        message: 'No files uploaded',
      };
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

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 100,
    });

    const chunks = await splitter.splitDocuments(documents);

    console.log('TOTAL PDF CHUNKS TO INSERT:', chunks.length);

    await (this.vectorStore as any).pool.query(
      `DELETE FROM chatbot_documents WHERE metadata->>'source' = $1`,
      [filePath],
    );

    await this.vectorStore.addDocuments(chunks);

    console.timeEnd('INSERT_PDF_TO_VECTOR_DB');

    return {
      success: true,
      chunksAdded: chunks.length,
    };
  }

  async ingest(body: IngestBodyDto) {
    const textDocs: Document[] = (body.docs || []).map(
      (doc) =>
        new Document({
          pageContent: doc.content,
          metadata: {
            source: doc.meta?.source ?? 'inline',
            ...doc.meta,
          },
        }),
    );

    const pdfDocs: Document[] = [];

    for (const pdfPath of body.pdfPaths || []) {
      const docs = await loadPdfAsDocuments(pdfPath);
      pdfDocs.push(...docs);
    }

    const allDocs = [...textDocs, ...pdfDocs];

    if (!allDocs.length) {
      return {
        success: false,
        message: 'No documents',
      };
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

  async similaritySearch(searchQuery: string, k = 8, limit = 4) {
    console.time('vectorSearch');

    const results = await this.vectorStore.similaritySearchWithScore(searchQuery, k);

    console.timeEnd('vectorSearch');

    console.table(
      results.map(([doc, score], index) => ({
        index,
        score,
        preview: doc.pageContent.slice(0, 160),
      })),
    );

    const docs = results
      .sort((a, b) => a[1] - b[1])
      .map(([doc]) => doc)
      .slice(0, limit);

    return docs;
  }
}
