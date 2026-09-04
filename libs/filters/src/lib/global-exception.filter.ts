import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { MetadataKeys } from '@common/constants/common.constant';
import { RequestWithMetadata } from '@common/interfaces/common/request-with-metadata.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithMetadata>();

    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);

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

  private extractMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      const { message } = response as { message?: string | string[] };

      if (message) {
        return Array.isArray(message) ? message.join(', ') : message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal Server Error';
  }
}
