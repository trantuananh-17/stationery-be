import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './modules/upoload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/upload-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
