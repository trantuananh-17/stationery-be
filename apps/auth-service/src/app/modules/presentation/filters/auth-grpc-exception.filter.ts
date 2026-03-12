import { status } from '@grpc/grpc-js';
import { RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import {
  AccountLockedError,
  CredentialNotFoundError,
  EmailAlreadyVerifiedError,
  EmailNotVerifiedError,
  InvalidCredentialError,
  InvalidCurrentPasswordError,
  InvalidResetTokenError,
  InvalidVerificationTokenError,
  ResetTokenExpiredError,
  ResetTokenNotFoundError,
  VerificationCooldownError,
  VerificationTokenExpiredError,
  VerificationTokenNotFoundError,
} from '../../domain/errors/credential.error';

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

    if (exception instanceof VerificationCooldownError) {
      return throwError(() => ({
        code: status.RESOURCE_EXHAUSTED,
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

    if (
      exception instanceof InvalidCurrentPasswordError ||
      exception instanceof InvalidVerificationTokenError ||
      exception instanceof InvalidResetTokenError
    ) {
      return throwError(() => ({
        code: status.INVALID_ARGUMENT,
        message: exception.message,
      }));
    }

    if (exception instanceof EmailAlreadyVerifiedError) {
      return throwError(() => ({
        code: status.ALREADY_EXISTS,
        message: exception.message,
      }));
    }

    if (
      exception instanceof VerificationTokenNotFoundError ||
      exception instanceof ResetTokenNotFoundError ||
      exception instanceof CredentialNotFoundError
    ) {
      return throwError(() => ({
        code: status.NOT_FOUND,
        message: exception.message,
      }));
    }

    if (
      exception instanceof VerificationTokenExpiredError ||
      exception instanceof ResetTokenExpiredError
    ) {
      return throwError(() => ({
        code: status.DEADLINE_EXCEEDED,
        message: exception.message,
      }));
    }

    return throwError(() => ({
      code: status.INTERNAL,
      message: exception?.message || 'Internal error',
    }));
  }
}
