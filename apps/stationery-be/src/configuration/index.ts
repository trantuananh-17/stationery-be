import { TcpConfiguration } from '@common/configuration/tcp.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { BaseConfiguration } from '@common/configuration/base.config';
import { MongoConfiguration } from '@common/configuration/mongo.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Configuration extends BaseConfiguration {
  // ValidateNested(): validate các field bên trong class AppConfiguration
  // Type(): chuyển đổi kiểu dữ liệu sang class AppConfiguration
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => MongoConfiguration)
  MONGO_CONFIG = new MongoConfiguration();
}

export const CONFIGURATION = new Configuration();

export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
