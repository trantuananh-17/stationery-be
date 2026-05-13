import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChatService } from '../services/chat.service';
import { IngestBodyDto } from '../dto/ingest.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ingest')
  ingest(@Body() body: IngestBodyDto) {
    return this.chatService.ingest(body || {});
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype === 'application/pdf') {
          callback(null, true);
        } else {
          callback(new Error('Only pdf files are allowed'), false);
        }
      },
    }),
  )
  async uploadAndIngest(@UploadedFiles() files: Express.Multer.File[]) {
    return this.chatService.handleFileUpload(files);
  }

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    return this.chatService.query(body?.question || '');
  }
}
