import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/product-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
