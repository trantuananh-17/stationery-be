import { DynamicModule, Module } from '@nestjs/common';
import { QUEUE_SERVICES } from '@common/constants/enums/queue.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { hostname } from 'os';
import { KafkaService } from './kafka.service';

@Module({})
export class KafkaModule {
  static register(serviceName: QUEUE_SERVICES): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: serviceName,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: `${serviceName}-${hostname()}`,
                    brokers: [configService.get<string>('KAFKA_CONFIG.URL') || 'localhost:9092'],
                  },
                },
                consumer: {
                  groupId: `${serviceName}-group`,
                },
              };
            },
          },
        ]),
      ],
      providers: [
        {
          provide: KafkaService,
          useFactory: (client) => new KafkaService(client),
          inject: [serviceName],
        },
      ],
      exports: [KafkaService],
    };
  }
}
