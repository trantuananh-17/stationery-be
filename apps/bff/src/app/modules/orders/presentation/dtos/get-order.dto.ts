import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class GetOrderDto {
  @ApiProperty({
    description: 'Order ID',
  })
  @IsUUID()
  orderId: string;
}
