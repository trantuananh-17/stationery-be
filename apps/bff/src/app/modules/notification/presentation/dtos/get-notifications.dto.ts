import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNumberString, IsOptional, IsUUID } from 'class-validator';
import {
  NotificationStatus,
  NotificationType,
} from '../../applications/ports/dtos/notification.dto';

export class GetNotificationsDto {
  @ApiPropertyOptional({
    default: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({
    default: 8,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({
    enum: NotificationStatus,
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiPropertyOptional({
    enum: NotificationType,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
