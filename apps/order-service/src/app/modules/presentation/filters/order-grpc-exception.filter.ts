import { status } from '@grpc/grpc-js';
import { RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import {
  InvalidOrderTotal,
  OrderNotFound,
  OrderNotItems,
  OrderNotPayable,
  OrderPair,
  OrderPaymentExpired,
} from '../../domain/errors/order.error';

export class OrderGrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: any): Observable<any> {
    if (exception?.code && typeof exception.code === 'number') {
      return throwError(() => ({
        code: exception.code,
        message: exception.details || exception.message,
      }));
    }

    if (exception instanceof OrderNotFound || exception instanceof OrderNotItems) {
      return throwError(() => ({
        code: status.NOT_FOUND,
        message: exception.message,
      }));
    }

    if (exception instanceof OrderNotPayable) {
      return throwError(() => ({
        code: status.RESOURCE_EXHAUSTED,
        message: exception.message,
      }));
    }

    if (exception instanceof OrderPair) {
      return throwError(() => ({
        code: status.FAILED_PRECONDITION,
        message: exception.message,
      }));
    }

    if (exception instanceof OrderPaymentExpired) {
      return throwError(() => ({
        code: status.PERMISSION_DENIED,
        message: exception.message,
      }));
    }

    if (exception instanceof InvalidOrderTotal) {
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
