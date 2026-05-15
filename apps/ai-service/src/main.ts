/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CONFIGURATION } from './configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const CONFIG = CONFIGURATION();
  const globalPrefix = CONFIG.GLOBAL_PREFIX;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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
  SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory, {
    swaggerOptions: {
      operationsSorter: (a: any, b: any): number => {
        const order: Record<string, number> = {
          post: 1,
          get: 2,
          put: 3,
          patch: 4,
          delete: 5,
        };

        return (order[a.get('method')] ?? 99) - (order[b.get('method')] ?? 99);
      },
    },
  });

  app.setGlobalPrefix(globalPrefix);
  const port = CONFIG.APP_CONFIG.PORT;

  await app.startAllMicroservices();
  // await app.listen(port);
  const host = '0.0.0.0';

  await app.listen(port, host);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
