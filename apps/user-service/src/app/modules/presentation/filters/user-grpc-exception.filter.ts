import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { GrpcErrorLike } from '@common/interfaces/grpc/grpc-error.interface';

import { EmailAlreadyExistsError } from '../../domain/errors/email-already-exists.error';
import { InvalidEmail } from '../../domain/errors/email-invalid.error';

@Catch()
export class UserGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: unknown): Observable<never> {
    const grpcError = exception as GrpcErrorLike;

    if (typeof grpcError?.code === 'number') {
      return throwError(() => ({
        code: grpcError.code,
        message: grpcError.details || grpcError.message,
      }));
    }

    if (exception instanceof EmailAlreadyExistsError) {
      return throwError(() => ({
        code: status.ALREADY_EXISTS,
        message: exception.message,
      }));
    }

    if (exception instanceof InvalidEmail) {
      return throwError(() => ({
        code: status.INVALID_ARGUMENT,
        message: exception.message,
      }));
    }

    return throwError(() => ({
      code: status.INTERNAL,
      message: grpcError?.message || 'Internal error',
    }));
  }
}
