import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/order-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
