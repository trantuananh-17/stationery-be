import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat.module';
import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/ai-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
    ChatModule,
  ],
  // providers: [{ provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor }],
})
export class AppModule {}
