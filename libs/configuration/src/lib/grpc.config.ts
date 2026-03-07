import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, GrpcOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
import { join } from 'path';

export enum GRPC_SERVICES {
  AUTH_SERVICE = 'GRPC_AUTH_SERVICE',
  USER_SERVICE = 'GRPC_USER_SERVICE',
}

export class GrpcConfiguration {
  @IsObject()
  @IsNotEmpty()
  GRPC_AUTH_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_USER_SERVICE: GrpcOptions & { name: string };

  constructor() {
    this.GRPC_AUTH_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.AUTH_SERVICE,
      protoPath: ['./proto/auth.proto'],
      host: process.env['AUTH_SERVICE_HOST'] || 'localhost',
      port: Number(process.env['AUTH_SERVICE_PORT']),
    });

    this.GRPC_USER_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.USER_SERVICE,
      protoPath: ['./proto/user.proto'],
      host: process.env['USER_SERVICE_HOST'] || 'localhost',
      port: Number(process.env['USER_SERVICE_PORT']),
    });
  }

  private static setValue({
    key,
    protoPath,
    port = 5100,
    host = '127.0.0.1',
  }: {
    key: GRPC_SERVICES;
    protoPath: string | string[];
    port?: number;
    host?: string;
  }): GrpcOptions & { name: string } {
    return {
      name: key,
      transport: Transport.GRPC,
      options: {
        package: key,
        protoPath: Array.isArray(protoPath)
          ? protoPath.map((path) => join(__dirname, path))
          : join(__dirname, protoPath),
        url: `${host}:${port}`,
      },
    };
  }
}

export const GrpcProvider = (serviceName: GRPC_SERVICES): ClientsProviderAsyncOptions => {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return configService.get(`GRPC_SERV.${serviceName}`) as GrpcOptions & { name: string };
    },
    name: serviceName,
  };
};
