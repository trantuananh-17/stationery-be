import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AppConfiguration {
  @Type(() => Number)
  @IsNumber()
  PORT: number;

  constructor() {
    this.PORT = Number(process.env['PORT']);
  }
}
