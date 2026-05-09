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
import { QUEUE_GROUPS } from '@common/constants/enums/queue.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const CONFIG = CONFIGURATION();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);

  const grpcPackage = configService.get<string>('GRPC_SERV.GRPC_USER_SERVICE.name');
  const grpcProtoPath = configService.get<string>('GRPC_SERV.GRPC_USER_SERVICE.options.protoPath');
  const grpcUrl = configService.get<string>('GRPC_SERV.GRPC_USER_SERVICE.options.url');

  if (!grpcPackage || !grpcProtoPath) {
    throw new Error('Missing GRPC_USER_SERVICE config');
  }

  Logger.debug('GRPC CONFIG', JSON.stringify(configService.get('GRPC_SERV.GRPC_USER_SERVICE')));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: grpcPackage,
      protoPath: grpcProtoPath,
      url: grpcUrl,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user-service',
        brokers: [configService.getOrThrow<string>('KAFKA_CONFIG.URL')],
      },
      consumer: {
        groupId: QUEUE_GROUPS.USER,
        allowAutoTopicCreation: true,
      },
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
