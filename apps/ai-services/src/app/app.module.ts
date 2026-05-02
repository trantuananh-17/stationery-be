import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/ai-service/.env', '.env'],
    }),
    ChatModule,
  ],
})
export class AppModule {}
