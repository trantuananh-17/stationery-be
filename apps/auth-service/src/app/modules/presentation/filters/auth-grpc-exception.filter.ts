import { Observable, throwError } from 'rxjs';
import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { InvalidCredentialError } from '../../domain/errors/invalid-credential.error';
import { EmailNotVerifiedError } from '../../domain/errors/email-not-verified.error';
import { AccountLockedError } from '../../domain/errors/account-locked.error';

@Catch()
export class AuthGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: any): Observable<any> {
    if (exception?.code && typeof exception.code === 'number') {
      return throwError(() => ({
        code: exception.code,
        message: exception.details || exception.message,
      }));
    }

    if (exception instanceof InvalidCredentialError) {
      return throwError(() => ({
        code: status.UNAUTHENTICATED,
        message: exception.message,
      }));
    }

    if (exception instanceof EmailNotVerifiedError) {
      return throwError(() => ({
        code: status.FAILED_PRECONDITION,
        message: exception.message,
      }));
    }

    if (exception instanceof AccountLockedError) {
      return throwError(() => ({
        code: status.PERMISSION_DENIED,
        message: exception.message,
      }));
    }

    return throwError(() => ({
      code: status.INTERNAL,
      message: exception?.message || 'Internal error',
    }));
  }
}
