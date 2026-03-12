import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { TypeOrmConfiguration } from '@common/configuration/type-orm.config';
import { GrpcConfiguration } from '@common/configuration/grpc.config';
import { JwtConfiguration } from '@common/configuration/jwt.config';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => AppConfiguration)
  JWT_CONFIG = new JwtConfiguration();

  @ValidateNested()
  @Type(() => TypeOrmConfiguration)
  TYPEORM_CONFIG = new TypeOrmConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV = new GrpcConfiguration();
}

export const CONFIGURATION = () => {
  const config = plainToInstance(Configuration, {});

  config.validate();

  return config;
};

export type TConfiguration = ReturnType<typeof CONFIGURATION>;
