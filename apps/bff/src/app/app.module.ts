import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { CONFIGURATION } from '../configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/products/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { OrderModule } from './modules/orders/order.module';

@Module({
  imports: [
    ProductModule,
    UserModule,
    AuthModule,
    CartModule,
    WebhookModule,
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/bff/.env'],
      load: [CONFIGURATION],
    }),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.STATIONARY_SERVICE)]),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
