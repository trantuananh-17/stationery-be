import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, catchError } from 'rxjs';
import { Request } from 'express';
import { MetadataKeys } from '@common/constants/common.constant';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { status } from '@grpc/grpc-js';

export const GRPC_HTTP_STATUS: Record<number, HttpStatus> = {
  [status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
  [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
};

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    const request: Request & {
      [MetadataKeys.PROCESS_ID]: string;
      [MetadataKeys.START_TIME]: number;
    } = ctx.getRequest();

    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];

    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - startTime;

        Logger.log({ data });

        return new ResponseDto({
          data,
          message: 'Success',
          statusCode: HttpStatus.OK,
          processID: processId,
          duration: `${duration} ms`,
        });
      }),

      catchError((error) => {
        const grpcCode = Number(error?.code);

        const isGrpcError = !Number.isNaN(grpcCode);

        if (isGrpcError) {
          this.logger.error({
            type: 'GRPC_ERROR',
            code: grpcCode,
            message: error?.details || error?.message,
            path: request.url,
            processId,
          });
        }

        const duration = Date.now() - startTime;

        const statusCode =
          GRPC_HTTP_STATUS[grpcCode] ??
          error?.statusCode ??
          error?.response?.statusCode ??
          HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
          error?.details ?? error?.response?.message ?? error?.message ?? 'Internal Server Error';

        throw new HttpException(
          new ResponseDto({
            data: null,
            message,
            statusCode,
            processID: processId,
            duration: `${duration} ms`,
          }),
          statusCode,
        );
      }),
    );
  }
}
