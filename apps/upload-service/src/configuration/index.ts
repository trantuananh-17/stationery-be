import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { S3Configuration } from '@common/configuration/s3.config';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => S3Configuration)
  S3_CONFIG = new S3Configuration();
}

export const CONFIGURATION = () => {
  const config = plainToInstance(Configuration, {});

  config.validate();

  return config;
};

export type TConfiguration = ReturnType<typeof CONFIGURATION>;
