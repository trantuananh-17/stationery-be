import { TcpConfiguration } from '@common/configuration/tcp.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { BaseConfiguration } from '@common/configuration/base.config';
import { ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { GrpcConfiguration } from '@common/configuration/grpc.config';
import { JwtConfiguration } from '@common/configuration/jwt.config';
import { StripeConfiguration } from '@common/configuration/stripe.config';
import { KafkaConfiguration } from '@common/configuration/kafka.config';

class Configuration extends BaseConfiguration {
  // ValidateNested(): validate các field bên trong class AppConfiguration
  // Type(): chuyển đổi kiểu dữ liệu sang class AppConfiguration
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => AppConfiguration)
  JWT_CONFIG = new JwtConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV = new GrpcConfiguration();

  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG = new StripeConfiguration();

  @ValidateNested()
  @Type(() => KafkaConfiguration)
  KAFKA_CONFIG = new KafkaConfiguration();
}
export const CONFIGURATION = () => {
  const config = plainToInstance(Configuration, {}, { enableImplicitConversion: true });

  config.validate();

  return config;
};

export type TConfiguration = ReturnType<typeof CONFIGURATION>;
