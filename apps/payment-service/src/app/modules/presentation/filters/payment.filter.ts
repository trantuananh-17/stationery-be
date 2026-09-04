import { status } from '@grpc/grpc-js';
import { GrpcErrorLike } from '@common/interfaces/grpc/grpc-error.interface';
import { RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

export class PaymentGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: unknown): Observable<never> {
    const grpcError = exception as GrpcErrorLike;

    if (typeof grpcError?.code === 'number') {
      return throwError(() => ({
        code: grpcError.code,
        message: grpcError.details || grpcError.message,
      }));
    }

    return throwError(() => ({
      code: status.INTERNAL,
      message: grpcError?.message || 'Internal error',
    }));
  }
}
