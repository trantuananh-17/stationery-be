import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './modules/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/payment-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
