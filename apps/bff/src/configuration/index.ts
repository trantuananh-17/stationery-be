import { TcpConfiguration } from '@common/configuration/tcp.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { BaseConfiguration } from '@common/configuration/base.config';
import { ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';

class Configuration extends BaseConfiguration {
  // ValidateNested(): validate các field bên trong class AppConfiguration
  // Type(): chuyển đổi kiểu dữ liệu sang class AppConfiguration
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();
}
export const CONFIGURATION = () => {
  const config = plainToInstance(Configuration, {}, { enableImplicitConversion: true });

  config.validate();

  return config;
};

export type TConfiguration = ReturnType<typeof CONFIGURATION>;
