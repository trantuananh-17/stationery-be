import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { MetadataKeys } from '@common/constants/common.constant';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception?.response?.message || exception?.message || 'Internal Server Error';

    response.status(status).json(
      new ResponseDto({
        data: null,
        message,
        statusCode: status,
        processID: processId,
        duration: `${Date.now() - startTime} ms`,
      }),
    );
  }
}
