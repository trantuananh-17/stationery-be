import { S3Provider } from '@common/configuration/s3.config';
import { Module } from '@nestjs/common';

@Module({
  providers: [S3Provider],
  exports: [S3Provider],
})
export class UploadInfrasModule {}
