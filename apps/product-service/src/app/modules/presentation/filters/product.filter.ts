import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { GrpcErrorLike } from '@common/interfaces/grpc/grpc-error.interface';
import { Observable, throwError } from 'rxjs';

import {
  CancelStockFailedError,
  ConfirmStockFailedError,
  InvalidPriceError,
  InvalidStockError,
  ProductDeletedError,
  ProductNotFoundError,
  SkuRequiredError,
} from '../../domain/errors/product.error';

@Catch()
export class ProductGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: unknown): Observable<never> {
    const grpcError = exception as GrpcErrorLike;

    if (typeof grpcError?.code === 'number') {
      return throwError(() => ({
        code: grpcError.code,
        message: grpcError.details || grpcError.message,
      }));
    }

    if (exception instanceof ProductNotFoundError) {
      return throwError(() => ({
        code: status.NOT_FOUND,
        message: exception.message,
      }));
    }

    if (
      exception instanceof InvalidPriceError ||
      exception instanceof InvalidStockError ||
      exception instanceof SkuRequiredError
    ) {
      return throwError(() => ({
        code: status.INVALID_ARGUMENT,
        message: exception.message,
      }));
    }

    if (
      exception instanceof CancelStockFailedError ||
      exception instanceof ConfirmStockFailedError
    ) {
      return throwError(() => ({
        code: status.FAILED_PRECONDITION,
        message: exception.message,
      }));
    }

    if (exception instanceof ProductDeletedError) {
      return throwError(() => ({
        code: status.FAILED_PRECONDITION,
        message: exception.message,
      }));
    }

    return throwError(() => ({
      code: status.INTERNAL,
      message: grpcError?.message || 'Internal error',
    }));
  }
}
