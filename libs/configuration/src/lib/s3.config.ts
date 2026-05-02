import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export const S3_CLIENT = 'S3_CLIENT';

export class S3Configuration {
  @IsObject()
  @IsNotEmpty()
  S3_CLIENT_CONFIG: S3ClientConfig;

  @IsString()
  @IsNotEmpty()
  AWS_S3_BUCKET: string;

  constructor() {
    this.S3_CLIENT_CONFIG = S3Configuration.setValue({
      region: process.env['AWS_REGION'] ?? '',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
    });

    this.AWS_S3_BUCKET = process.env['AWS_S3_BUCKET'] ?? '';
  }

  private static setValue({
    region,
    accessKeyId,
    secretAccessKey,
  }: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  }): S3ClientConfig {
    return {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };
  }
}

export const S3Provider = {
  provide: S3_CLIENT,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const config = configService.get<S3Configuration>('S3_CONFIG');

    if (!config) {
      throw new Error('S3_CONFIG is not defined');
    }

    return new S3Client(config.S3_CLIENT_CONFIG);
  },
};
