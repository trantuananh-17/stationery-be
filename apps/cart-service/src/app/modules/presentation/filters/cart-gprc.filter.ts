// cart-grpc-exception.filter.ts

import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { GrpcErrorLike } from '@common/interfaces/grpc/grpc-error.interface';
import { Observable, throwError } from 'rxjs';

import {
  CartCheckedOutCannotExpireError,
  CartCurrencyRequiredError,
  CartEmptyError,
  CartIdRequiredError,
  CartItemNotFoundError,
  CartNotFoundError,
  CartNotActiveError,
  CartUserOrSessionRequiredError,
  InvalidCartItemQuantityError,
  OnlyActiveCartCanBeMergedError,
  ProductNotFoundInCartError,
  ProductOutOfStockError,
  QuantityExceedsStockError,
  UserRequired,
} from '../../domain/errors/cart.error';

@Catch()
export class CartGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: unknown): Observable<never> {
    const grpcError = exception as GrpcErrorLike;

    if (typeof grpcError?.code === 'number') {
      return throwError(() => ({
        code: grpcError.code,
        message: grpcError.details || grpcError.message,
      }));
    }

    if (exception instanceof UserRequired) {
      return throwError(() => ({
        code: status.UNAUTHENTICATED,
        message: exception.message,
      }));
    }

    if (
      exception instanceof CartNotFoundError ||
      exception instanceof CartItemNotFoundError ||
      exception instanceof ProductNotFoundInCartError
    ) {
      return throwError(() => ({
        code: status.NOT_FOUND,
        message: exception.message,
      }));
    }

    if (
      exception instanceof CartUserOrSessionRequiredError ||
      exception instanceof CartCurrencyRequiredError ||
      exception instanceof CartIdRequiredError ||
      exception instanceof InvalidCartItemQuantityError
    ) {
      return throwError(() => ({
        code: status.INVALID_ARGUMENT,
        message: exception.message,
      }));
    }

    if (
      exception instanceof CartNotActiveError ||
      exception instanceof CartCheckedOutCannotExpireError ||
      exception instanceof CartEmptyError ||
      exception instanceof OnlyActiveCartCanBeMergedError ||
      exception instanceof ProductOutOfStockError ||
      exception instanceof QuantityExceedsStockError
    ) {
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
