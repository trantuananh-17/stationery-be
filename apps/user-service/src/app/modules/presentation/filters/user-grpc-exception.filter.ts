import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';

import { EmailAlreadyExistsError } from '../../domain/errors/email-already-exists.error';
import { InvalidEmail } from '../../domain/errors/email-invalid.error';

@Catch()
export class UserGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: any): Observable<any> {
    if (exception?.code && typeof exception.code === 'number') {
      return throwError(() => ({
        code: exception.code,
        message: exception.details || exception.message,
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
      message: exception?.message || 'Internal error',
    }));
  }
}
