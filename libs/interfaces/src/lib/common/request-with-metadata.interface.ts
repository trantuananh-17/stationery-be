import { MetadataKeys } from '@common/constants/common.constant';
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

/**
 * Request sau khi đi qua LoggerMiddleware và JwtAuthGuard.
 * Hai key metadata do middleware gắn thêm nên không có sẵn trong Request của express.
 */
export interface RequestWithMetadata extends Request {
  [MetadataKeys.PROCESS_ID]?: string;
  [MetadataKeys.START_TIME]?: number;
  user?: JwtPayload;
}
