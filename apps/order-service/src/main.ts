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

  const grpcPackage = configService.get<string>('GRPC_SERV.GRPC_ORDER_SERVICE.name');
  const grpcProtoPath = configService.get<string>('GRPC_SERV.GRPC_ORDER_SERVICE.options.protoPath');
  const grpcUrl = configService.get<string>('GRPC_SERV.GRPC_ORDER_SERVICE.options.url');

  if (!grpcPackage || !grpcProtoPath) {
    throw new Error('Missing GRPC_ORDER_SERVICE config');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: grpcPackage,
      protoPath: grpcProtoPath,
      url: grpcUrl,
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
