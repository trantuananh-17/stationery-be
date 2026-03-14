import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, GrpcOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
import { join } from 'path';

export enum GRPC_SERVICES {
  AUTH_SERVICE = 'GRPC_AUTH_SERVICE',
  USER_SERVICE = 'GRPC_USER_SERVICE',
  ORDER_SERVICE = 'GRPC_ORDER_SERVICE',
  CART_SERVICE = 'GRPC_CART_SERVICE',
  INVENTORY_SERVICE = 'GRPC_INVENTORY_SERVICE',
  PRODUCT_SERVICE = 'GRPC_PRODUCT_SERVICE',
}

type GrpcServiceConfig = {
  proto: string;
  hostEnv: string;
  portEnv: string;
};

const GRPC_SERVICE_CONFIG: Record<keyof typeof GRPC_SERVICES, GrpcServiceConfig> = {
  AUTH_SERVICE: {
    proto: './proto/auth.proto',
    hostEnv: 'AUTH_SERVICE_HOST',
    portEnv: 'AUTH_SERVICE_PORT',
  },
  USER_SERVICE: {
    proto: './proto/user.proto',
    hostEnv: 'USER_SERVICE_HOST',
    portEnv: 'USER_SERVICE_PORT',
  },
  ORDER_SERVICE: {
    proto: './proto/order.proto',
    hostEnv: 'ORDER_SERVICE_HOST',
    portEnv: 'ORDER_SERVICE_PORT',
  },
  CART_SERVICE: {
    proto: './proto/cart.proto',
    hostEnv: 'CART_SERVICE_HOST',
    portEnv: 'CART_SERVICE_PORT',
  },
  INVENTORY_SERVICE: {
    proto: './proto/inventory.proto',
    hostEnv: 'INVENTORY_SERVICE_HOST',
    portEnv: 'INVENTORY_SERVICE_PORT',
  },
  PRODUCT_SERVICE: {
    proto: './proto/product.proto',
    hostEnv: 'PRODUCT_SERVICE_HOST',
    portEnv: 'PRODUCT_SERVICE_PORT',
  },
};

export class GrpcConfiguration {
  @IsObject()
  @IsNotEmpty()
  GRPC_AUTH_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_USER_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_ORDER_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_CART_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_INVENTORY_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_PRODUCT_SERVICE: GrpcOptions & { name: string };

  constructor() {
    (Object.keys(GRPC_SERVICE_CONFIG) as (keyof typeof GRPC_SERVICE_CONFIG)[]).forEach((key) => {
      const value = GRPC_SERVICE_CONFIG[key];

      this[`GRPC_${key}` as keyof GrpcConfiguration] = GrpcConfiguration.setValue({
        key: GRPC_SERVICES[key],
        protoPath: value.proto,
        host: process.env[value.hostEnv] || 'localhost',
        port: Number(process.env[value.portEnv]),
      });
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
