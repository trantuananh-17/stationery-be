import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { GrpcConfiguration } from '@common/configuration/grpc.config';
import { StripeConfiguration } from '@common/configuration/stripe.config';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV = new GrpcConfiguration();

  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG = new StripeConfiguration();
}

export const CONFIGURATION = () => {
  const config = plainToInstance(Configuration, {});

  config.validate();

  return config;
};

export type TConfiguration = ReturnType<typeof CONFIGURATION>;
