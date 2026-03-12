import { status } from '@grpc/grpc-js';
import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { AccountLockedError } from '../../domain/errors/account-locked.error';
import { EmailAlreadyVerifiedError } from '../../domain/errors/email-already-verified.error';
import { EmailNotVerifiedError } from '../../domain/errors/email-not-verified.error';
import { InvalidCredentialError } from '../../domain/errors/invalid-credential.error';
import { InvalidCurrentPasswordError } from '../../domain/errors/invalid-current-password.error';
import { InvalidResetTokenError } from '../../domain/errors/invalid-reset-token.error';
import { InvalidVerificationTokenError } from '../../domain/errors/invalid-verification-token.error';
import { ResetTokenExpiredError } from '../../domain/errors/reset-token-expired.error';
import { ResetTokenNotFoundError } from '../../domain/errors/reset-token-not-found.error';
import { VerificationTokenExpiredError } from '../../domain/errors/verification-token-expired.error';
import { VerificationTokenNotFoundError } from '../../domain/errors/verification-token-not-found.error';

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
      exception instanceof ResetTokenNotFoundError
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
