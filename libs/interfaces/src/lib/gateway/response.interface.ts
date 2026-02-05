import { HttpStatus } from '@nestjs/common';
import { HTTP_MESSAGE } from '@common/constants/enums/http-message.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ type: String })
  message: string = HTTP_MESSAGE.OK;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  processID?: string;

  @ApiProperty({ type: Number })
  statusCode: number = HttpStatus.OK;

  @ApiProperty()
  duration?: string;

  constructor(data: Partial<ResponseDto<T>>) {
    Object.assign(this, data);
  }
}
