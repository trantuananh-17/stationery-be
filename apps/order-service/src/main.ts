/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION } from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const CONFIG = CONFIGURATION();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);

  Logger.debug('GRPC CONFIG', JSON.stringify(configService.get('GRPC_SERV.GRPC_ORDER_SERVICE')));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: configService.get<string>('GRPC_SERV.GRPC_ORDER_SERVICE.name'),
      protoPath: configService.get<string>('GRPC_SERV.GRPC_ORDER_SERVICE.options.protoPath'),
      url: configService.get<string>('GRPC_SERV.GRPC_ORDER_SERVICE.options.url'),
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = CONFIG.APP_CONFIG.PORT;

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
