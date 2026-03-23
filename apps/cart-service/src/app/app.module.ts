import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { CartModule } from './modules/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/cart-service/.env', '.env'],
      load: [CONFIGURATION],
    }),
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
