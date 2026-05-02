import { Module } from '@nestjs/common';
import { UploadInfrasModule } from './infrastructure/s3-infra.module';
import { UploadService } from './applications/services/upload.service';
import { UploadController } from './presentation/controllers/upload.controller';

@Module({
  imports: [UploadInfrasModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
