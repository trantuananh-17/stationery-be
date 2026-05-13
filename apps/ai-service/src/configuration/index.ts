import { AppConfiguration } from '@common/configuration/app.config';
import { BaseConfiguration } from '@common/configuration/base.config';
import { GrpcConfiguration } from '@common/configuration/grpc.config';
import { plainToInstance, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  // ValidateNested(): validate các field bên trong class AppConfiguration
  // Type(): chuyển đổi kiểu dữ liệu sang class AppConfiguration
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV = new GrpcConfiguration();
}
export const CONFIGURATION = () => {
  const config = plainToInstance(Configuration, {}, { enableImplicitConversion: true });

  config.validate();

  return config;
};

export type TConfiguration = ReturnType<typeof CONFIGURATION>;
