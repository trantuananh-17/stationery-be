import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtConfiguration {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env['JWT_SECRET'] as string;
  }
}

export const JwtProvider = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_CONFIG.JWT_SECRET'),
  }),
});
