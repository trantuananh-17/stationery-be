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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const CONFIG = CONFIGURATION();

  const globalPrefix = CONFIG.GLOBAL_PREFIX;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('TCP_SERV.TCP_PRODUCT_SERVICE.options.host'),
      port: configService.get<number>('TCP_SERV.TCP_PRODUCT_SERVICE.options.port'),
    },
  });

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Stationery-bff API')
    .setDescription('The Stationery-bff API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

  // const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = CONFIG.APP_CONFIG.PORT;

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
