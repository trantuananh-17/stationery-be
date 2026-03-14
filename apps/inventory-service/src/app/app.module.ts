import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/inventory-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
